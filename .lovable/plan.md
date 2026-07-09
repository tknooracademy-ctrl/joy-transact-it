# Kerala Snacks E-Commerce — Build Plan

This is a large scope. Current project is a single donation page with Razorpay. To reach the full spec, we'll transform it into a full storefront + admin. I recommend shipping in phases so you can review and use the site early.

## Phase 1 — Foundation (storefront skeleton + data model)
- Brand + design system: warm Kerala palette (turmeric, coconut, spice red), display + body font pair, rounded 0.75rem cards, mobile-first layout.
- Routing: Home, Shop, Category, Product, Cart, Checkout, Order Success, Account, Orders, Wishlist, About, Contact, Privacy, Terms, Refund, Shipping, 404.
- Database (Lovable Cloud / Supabase) with RLS + GRANTs:
  - `categories`, `products`, `product_variants` (weights), `product_images`
  - `profiles`, `addresses`, `user_roles` (enum: admin, customer) via `has_role()`
  - `carts`, `cart_items` (guest via localStorage; user via table)
  - `orders`, `order_items`, `coupons`, `reviews`, `wishlist`, `banners`, `settings`, `audit_logs`
- Storage buckets: `product-images` (public), `banners` (public), `invoices` (private).
- Seed a handful of sample products per category.

## Phase 2 — Auth & Account
- Email/password + Google sign-in (Lovable Cloud managed).
- Email verification, forgot/reset password (`/reset-password` route).
- Profile page + saved addresses CRUD.

## Phase 3 — Catalog & Discovery
- Homepage: hero slider, featured/best sellers/new arrivals, category grid, offers, reviews, newsletter form.
- Category + Shop pages with filters (category, price, weight, in-stock), sorts, pagination.
- Product page: image gallery + zoom, variants, ingredients, nutrition, shelf life, FSSAI, related products, reviews & ratings.
- Smart search (name + tags).
- Recently viewed (localStorage), wishlist.

## Phase 4 — Cart, Checkout & Razorpay
- Cart with quantity, remove, coupon apply, shipping calc.
- Checkout: shipping/billing address, delivery method, COD toggle.
- Razorpay live integration (already wired) extended for order metadata; verify signature edge function creates the order record on success.
- Order confirmation + email receipt (via edge function).

## Phase 5 — Orders & Customer Features
- Order history, tracking status timeline, cancel, return request.
- PDF invoice generation (edge function → private storage).
- Notifications (in-app), Contact form, FAQ.
- Live chat: simple embedded widget stub (Tawk.to) unless you want a custom one.

## Phase 6 — Admin Panel (`/admin`, role-gated)
- Dashboard: revenue, orders, customers, low-stock alerts, charts.
- Products: CRUD, images upload, variants, bulk CSV upload.
- Orders: status transitions, refund, invoice download.
- Customers: list, details, block/unblock.
- Coupons, Banners, Reports (daily/weekly/monthly), Settings (shipping, SEO, email).
- Audit logs table populated on admin actions.

## Phase 7 — SEO, PWA, Policies, Hardening
- `react-helmet-async` for per-route meta, JSON-LD (Product, Organization, BreadcrumbList), canonical, OG tags.
- `sitemap.xml` generator + `robots.txt` (already present).
- PWA: manifest + service worker (excluding `/~oauth`).
- Policy pages content (you provide business specifics: address, FSSAI #, GSTIN, return window, shipping zones/rates).
- Rate limiting on edge functions, input validation (zod), RLS review, security scan.

## Technical notes
- Stack stays: React + Vite + TS + Tailwind + shadcn + Lovable Cloud + Razorpay.
- Security: RLS on every table, `user_roles` separate table with `has_role()` security-definer, zod validation server-side, HTTPS via Lovable hosting, JWT via Supabase auth.
- Backups: Lovable Cloud handles Postgres backups automatically.

## What I need from you before I start Phase 1
1. **Brand name** and one-line tagline.
2. **Logo** (upload) or should I generate one?
3. **FSSAI license number, GSTIN, business address, support email/phone** (for footer + invoices + policies). Placeholder okay for now?
4. **Shipping**: flat rate? free above ₹X? zones? COD yes/no?
5. **Scope confirmation**: Shall I start with Phase 1 (foundation + data model + storefront skeleton with sample data) in the next turn, or do you want a different order?

Reply with answers (or "use placeholders, start Phase 1") and I'll begin.
