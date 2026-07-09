import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const OrderSuccess = () => (
  <>
    <SEO title="Order Confirmed — KeralaChips" />
    <div className="container py-24 text-center max-w-md mx-auto">
      <CheckCircle2 className="h-16 w-16 mx-auto text-primary mb-6" />
      <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-6">Thank you for shopping with KeralaChips. We'll email your invoice shortly.</p>
      <div className="flex gap-3 justify-center">
        <Button asChild><Link to="/shop">Continue shopping</Link></Button>
        <Button variant="outline" asChild><Link to="/account/orders">View orders</Link></Button>
      </div>
    </div>
  </>
);
export default OrderSuccess;
