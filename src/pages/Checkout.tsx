import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/SEO";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const addressSchema = z.object({
  recipient_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^\+?\d{10,15}$/, "Invalid phone"),
  email: z.string().trim().email(),
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "6-digit pincode"),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    recipient_name: "", phone: "", email: user?.email ?? "",
    line1: "", line2: "", city: "", state: "Kerala", pincode: "", notes: "",
  });

  const sub = subtotal();
  const shipping = sub >= 500 || sub === 0 ? 0 : 60;
  const total = sub + shipping;

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Button onClick={() => navigate("/shop")}>Shop now</Button>
      </div>
    );
  }

  const handlePay = async () => {
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Please check your details", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    if (!window.Razorpay) {
      toast({ title: "Payment loader failed. Refresh and retry.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: Math.round(total * 100),
          name: form.recipient_name,
          message: form.notes,
        },
      });
      if (error) throw error;
      const orderId = data?.orderId ?? data?.order_id;
      const keyId = data?.keyId ?? data?.key_id;
      if (!orderId) throw new Error("No order ID returned");

      const rzp = new window.Razorpay({
        key: keyId,
        amount: data.amount,
        currency: data.currency,
        name: "KeralaChips",
        description: `Order (${items.length} items)`,
        order_id: orderId,
        prefill: { name: form.recipient_name, email: form.email, contact: form.phone },
        notes: {
          items: items.map((i) => `${i.name} (${i.variantLabel}) x${i.quantity}`).join(", "),
          address: `${form.line1}, ${form.city}, ${form.state} - ${form.pincode}`,
        },
        theme: { color: "#ea580c" },
        handler: async (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const { data: v, error: verr } = await supabase.functions.invoke("verify-razorpay-payment", { body: r });
            if (verr || !v?.verified) { navigate("/order-cancel"); return; }
            clear();
            navigate("/order-success");
          } catch {
            navigate("/order-cancel");
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (e) {
      console.error(e);
      toast({ title: "Something went wrong", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Checkout — KeralaChips" canonical="/checkout" />
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-6 space-y-4">
            <h2 className="font-bold text-lg mb-2">Shipping Address</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Full name</Label><Input value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" /></div>
              <div className="md:col-span-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Address line 1</Label><Input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Address line 2 (optional)</Label><Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} /></div>
              <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
              <div><Label>Pincode</Label><Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
            </div>
            <div><Label>Order notes (optional)</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </Card>

          <Card className="p-6 space-y-4 h-fit sticky top-24">
            <h2 className="font-bold text-lg">Order Summary</h2>
            <div className="space-y-2 max-h-64 overflow-auto">
              {items.map((i) => (
                <div key={i.variantId} className="flex justify-between text-sm">
                  <span className="line-clamp-1">{i.name} ({i.variantLabel}) × {i.quantity}</span>
                  <span className="font-medium ml-2">₹{(i.price * i.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{sub.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            <Button className="w-full" size="lg" onClick={handlePay} disabled={loading}>
              {loading ? "Processing…" : `Pay ₹${total.toFixed(0)}`}
            </Button>
            <p className="text-xs text-center text-muted-foreground">UPI, Cards, Netbanking & Wallets · Secured by Razorpay</p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Checkout;
