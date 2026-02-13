

# Donation / Tip Payment Page

## Overview
A clean, simple donation page where visitors can make one-time contributions via Stripe — no account required.

## Features

### 1. Donation Landing Page
- Attractive hero section with a message explaining the cause or purpose
- Preset donation amounts (e.g. $5, $10, $25, $50) as clickable buttons
- Custom amount input for flexible donations
- Optional name and message fields (no login needed)
- "Donate" button that initiates Stripe Checkout

### 2. Stripe Checkout Integration
- Secure payment processing via Stripe Checkout (hosted by Stripe)
- Supports credit/debit cards and other Stripe-enabled payment methods
- Requires enabling Lovable's Stripe integration and connecting a Supabase/Cloud backend for the edge function

### 3. Success & Cancel Pages
- **Success page**: Thank-you message after a successful donation
- **Cancel page**: Friendly message if the user cancels, with option to try again

## Design
- Clean, modern single-page layout
- Mobile-responsive
- Warm, inviting color palette suitable for a donation context

