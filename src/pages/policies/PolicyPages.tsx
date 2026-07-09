import { ReactNode } from "react";
import { SEO } from "@/components/SEO";

const Page = ({ title, children, path }: { title: string; children: ReactNode; path: string }) => (
  <>
    <SEO title={`${title} — KeralaChips`} canonical={path} />
    <div className="container py-12 max-w-3xl prose prose-slate">
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
      <div className="space-y-4 text-muted-foreground leading-relaxed">{children}</div>
    </div>
  </>
);

export const About = () => (
  <Page title="About Us" path="/about">
    <p>KeralaChips is a family-run brand celebrating the authentic flavours of Kerala. Every snack is prepared in small batches using traditional recipes and pure coconut oil.</p>
    <p>We ship freshly-made snacks across India so a taste of home is always within reach.</p>
  </Page>
);

export const Contact = () => (
  <Page title="Contact Us" path="/contact">
    <p>Email: support@keralachips.example</p>
    <p>Phone: +91-00000-00000</p>
    <p>Address: [Business address], Kerala, India</p>
  </Page>
);

export const FAQ = () => (
  <Page title="FAQ" path="/faq">
    <h3 className="text-foreground font-semibold">How long does shipping take?</h3>
    <p>3–5 business days across India.</p>
    <h3 className="text-foreground font-semibold">What is the shelf life?</h3>
    <p>Most products stay fresh for 45–90 days. Check each product page for details.</p>
    <h3 className="text-foreground font-semibold">Do you accept COD?</h3>
    <p>Currently we accept prepaid payments via Razorpay (UPI, Cards, Netbanking, Wallets).</p>
  </Page>
);

export const Privacy = () => (
  <Page title="Privacy Policy" path="/privacy">
    <p>We collect only the information needed to process your order (name, address, phone, email). Payment details are handled directly by Razorpay and are never stored on our servers.</p>
    <p>We never sell or share your personal data with third parties except couriers and payment processors required to fulfil your order.</p>
  </Page>
);

export const Terms = () => (
  <Page title="Terms & Conditions" path="/terms">
    <p>By using this website you agree to these Terms. All products are sold subject to availability. Prices and product details may change without notice.</p>
    <p>All disputes are subject to the jurisdiction of courts in Kerala, India.</p>
  </Page>
);

export const RefundPolicy = () => (
  <Page title="Refund & Cancellation Policy" path="/refund-policy">
    <p>Orders can be cancelled within 2 hours of placement or before shipping — whichever is earlier. Refunds are processed to the original payment method within 5–7 business days.</p>
    <p>For damaged or incorrect items, contact us within 48 hours of delivery with photos and we'll arrange a replacement or refund.</p>
  </Page>
);

export const ShippingPolicy = () => (
  <Page title="Shipping & Delivery Policy" path="/shipping-policy">
    <p>We ship across India via trusted courier partners.</p>
    <ul className="list-disc pl-6 space-y-1">
      <li>Flat shipping ₹60 · Free above ₹500</li>
      <li>Dispatch within 1–2 business days</li>
      <li>Delivery in 3–5 business days</li>
    </ul>
  </Page>
);
