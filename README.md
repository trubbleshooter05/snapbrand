# SNAPBRAND

AI-powered brand asset generation platform built with Next.js 14, Supabase, and Stripe.

## Features

- **AI-Powered Generation**: Generate logos, color palettes, and complete brand packages using OpenAI's DALL-E 3
- **Authentication**: Secure auth with Supabase (Google OAuth + email/password)
- **Subscription Management**: Stripe integration with Pro plan at $9.99/month
- **Asset Storage**: Vercel Blob for secure asset storage and delivery
- **Free Trial**: 3 free generations for unauthed users
- **Modern UI**: Built with Tailwind CSS for a polished user experience

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Payment**: Stripe
- **AI**: OpenAI API (DALL-E 3, GPT-4)
- **Storage**: Vercel Blob
- **TypeScript**: Type-safe development

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account
- OpenAI API key
- Vercel Blob token

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Configure all required keys (see Configuration section below)

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

See the detailed setup guides:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database and auth configuration
- [STRIPE_SETUP.md](./STRIPE_SETUP.md) - Payment processing setup

### Required Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=

# OpenAI
OPENAI_API_KEY=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=
```

## Project Structure

```
snapbrand/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── auth/
│   ├── dashboard/
│   ├── pricing/
│   └── api/
├── components/
├── lib/
└── public/
```

## Key Features

### Authentication
- Email/password signup and login
- Google OAuth integration
- Session management with Supabase

### Pricing
- **Free Plan**: 3 free generations, PNG export
- **Pro Plan**: $9.99/month, unlimited generations, SVG export, commercial license

### Asset Generation
- Brand name and description input
- GPT-4 powered prompt generation
- DALL-E 3 image generation
- Automatic Vercel Blob storage
- Database tracking

## API Endpoints

### POST /api/generate
Generate a new brand asset

### POST /api/stripe/checkout
Create Stripe checkout session

### POST /api/stripe/webhook
Handle Stripe webhook events

## Deployment

Deploy to Vercel and configure environment variables in project settings.

Update Supabase and Stripe configurations with your production domain.

## Support

See README for more details on development and troubleshooting.
