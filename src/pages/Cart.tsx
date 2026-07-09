import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Minus, Plus } from "lucide-react";
import { SEO } from "@/components/SEO";

const Cart = () => {
  const { items, updateQty, removeItem, subtotal } = useCart();
  const sub = subtotal();
  const shipping = sub >= 500 || sub === 0 ? 0 : 60;

  return (
    <>
      <SEO title="Your Cart — KeralaChips" canonical="/cart" />
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild><Link to="/shop">Continue shopping</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map((i) => (
                <Card key={i.variantId} className="p-4 flex gap-4 items-center">
                  <Link to={`/product/${i.productSlug}`} className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {i.image && <img src={i.image} alt={i.name} className="h-full w-full object-cover" />}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${i.productSlug}`} className="font-semibold hover:text-primary line-clamp-1">{i.name}</Link>
                    <p className="text-sm text-muted-foreground">{i.variantLabel}</p>
                    <p className="font-semibold text-primary mt-1">₹{i.price}</p>
                  </div>
                  <div className="flex items-center border rounded-lg">
                    <Button variant="ghost" size="icon" onClick={() => updateQty(i.variantId, i.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                    <span className="w-8 text-center font-semibold text-sm">{i.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => updateQty(i.variantId, i.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(i.variantId)}><Trash2 className="h-4 w-4" /></Button>
                </Card>
              ))}
            </div>
            <div>
              <Card className="p-6 space-y-4 sticky top-24">
                <h2 className="font-bold text-lg">Order Summary</h2>
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{sub.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg"><span>Total</span><span>₹{(sub + shipping).toFixed(2)}</span></div>
                <Button className="w-full" size="lg" asChild><Link to="/checkout">Proceed to Checkout</Link></Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
