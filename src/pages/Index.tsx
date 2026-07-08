import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const PRESET_AMOUNTS = [100, 250, 500, 1000];

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(250);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const donationAmount = isCustom ? parseFloat(customAmount) : selectedAmount;

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustomFocus = () => {
    setIsCustom(true);
    setSelectedAmount(null);
  };

  const handleDonate = async () => {
    if (!donationAmount || donationAmount < 1) {
      toast({
        title: "Invalid amount",
        description: "Please enter an amount of at least ₹1.",
        variant: "destructive",
      });
      return;
    }

    if (!window.Razorpay) {
      toast({
        title: "Razorpay not loaded",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: {
          amount: Math.round(donationAmount * 100),
          name: name || undefined,
          message: message || undefined,
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
        name: "Support Our Cause",
        description: "Donation",
        order_id: orderId,

        prefill: {
          name: name || "",
        },
        notes: {
          message: message || "",
        },
        theme: { color: "#ea580c" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              { body: response }
            );
            if (verifyError || !verifyData?.verified) {
              navigate("/donation-cancel");
              return;
            }
            navigate("/donation-success");
          } catch {
            navigate("/donation-cancel");
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <section className="text-center max-w-xl mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-6">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
          Support Our Cause
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Your generous donation helps us continue making a difference. Every contribution, big or small, matters.
        </p>
      </section>

      <Card className="w-full max-w-md shadow-lg border-border/60">
        <CardContent className="p-8 space-y-6">
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              Choose an amount
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount && !isCustom ? "default" : "outline"}
                  className="text-base font-semibold h-12"
                  onClick={() => handlePresetClick(amount)}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="custom-amount" className="text-sm font-medium text-foreground mb-2 block">
              Or enter a custom amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
              <Input
                id="custom-amount"
                type="number"
                min="1"
                step="1"
                placeholder="0"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                onFocus={handleCustomFocus}
                className="pl-7 h-12 text-base"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="donor-name" className="text-sm font-medium text-foreground mb-2 block">
                Your name <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="donor-name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>
            <div>
              <Label htmlFor="donor-message" className="text-sm font-medium text-foreground mb-2 block">
                Leave a message <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="donor-message"
                placeholder="Keep up the great work!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <Button
            onClick={handleDonate}
            disabled={isLoading || (!donationAmount || donationAmount < 1)}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isLoading ? (
              "Processing…"
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" />
                Donate {donationAmount && donationAmount >= 1 ? `₹${donationAmount}` : ""}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            UPI, Cards, Netbanking & Wallets supported. Securely processed via Razorpay.
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default Index;
