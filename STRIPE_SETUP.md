# Stripe Setup Guide

This guide will help you set up Stripe for SNAPBRAND's Pro plan at $9.99/month.

## 1. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Verify your email and complete the account setup

## 2. Create a Product and Price

1. In the Stripe Dashboard, go to **Products**
2. Click **Add product**
3. Fill in the details:
   - **Name**: SNAPBRAND Pro
   - **Description**: Unlimited brand asset generations and premium features
4. Click **Create product**
5. In the **Pricing** section, click **Add pricing**
6. Set up the recurring price:
   - **Price**: $9.99
   - **Billing period**: Monthly
   - **Recurring**: Yes
7. Click **Save product**

## 3. Get API Keys

1. Go to **Developers** → **API keys**
2. Copy the **Secret key** and add to `.env.local`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   ```
3. Copy the **Publishable key** and add to `.env.local`:
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   ```

## 4. Get Your Price ID

1. Go to **Products** and click on **SNAPBRAND Pro**
2. Copy the **Price ID** (looks like `price_xxx`)
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxx
   ```

## 5. Set Up Webhooks

1. Go to **Developers** → **Webhooks**
2. Click **Add an endpoint**
3. Set the endpoint URL:
   - Production: `https://your-domain.com/api/stripe/webhook`
   - Local development: Use a tool like ngrok to expose your local server
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Click the endpoint to view the **Signing secret**
7. Add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

## 6. Test Webhook Locally

For local development, use the Stripe CLI:

```bash
# Install Stripe CLI (if not already installed)
# macOS:
brew install stripe/stripe-cli/stripe

# Listen for webhook events
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the signing secret and add to .env.local
```

## Environment Variables

Ensure your `.env.local` has all Stripe variables:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing

1. Go to the pricing page
2. Click "Upgrade to Pro"
3. In test mode, use card number: `4242 4242 4242 4242`
4. Use any future expiration date and any CVC
5. Check your Supabase database to verify the subscription was created
