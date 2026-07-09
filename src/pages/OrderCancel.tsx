import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const OrderCancel = () => (
  <>
    <SEO title="Payment Cancelled — KeralaChips" />
    <div className="container py-24 text-center max-w-md mx-auto">
      <XCircle className="h-16 w-16 mx-auto text-destructive mb-6" />
      <h1 className="text-3xl font-bold mb-3">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-6">No worries — your cart is saved. Try again whenever you're ready.</p>
      <Button asChild><Link to="/checkout">Return to checkout</Link></Button>
    </div>
  </>
);
export default OrderCancel;
