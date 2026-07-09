import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t bg-secondary/40 mt-16">
    <div className="container py-12 grid gap-8 md:grid-cols-4">
      <div>
        <h3 className="font-bold mb-3">KeralaChips</h3>
        <p className="text-sm text-muted-foreground">Authentic Kerala snacks delivered across India.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Shop</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/shop" className="hover:text-primary">All Products</Link></li>
          <li><Link to="/category/banana-chips" className="hover:text-primary">Banana Chips</Link></li>
          <li><Link to="/category/mixture" className="hover:text-primary">Mixture</Link></li>
          <li><Link to="/category/gift-boxes" className="hover:text-primary">Gift Boxes</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Company</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Policies</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
          <li><Link to="/refund-policy" className="hover:text-primary">Refund & Cancellation</Link></li>
          <li><Link to="/shipping-policy" className="hover:text-primary">Shipping & Delivery</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t">
      <div className="container py-4 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} KeralaChips. All rights reserved.</span>
        <span>FSSAI Lic No. 12345678901234</span>
      </div>
    </div>
  </footer>
);
