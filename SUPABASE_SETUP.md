# Supabase Setup Guide

This guide will help you set up the necessary tables and configurations in Supabase for SNAPBRAND.

## 1. Authentication Setup

### Enable Google OAuth

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Click on **Google**
4. Set up OAuth with your Google Cloud credentials:
   - Redirect URI: `https://your-domain.com/auth/callback`
   - For local development: `http://localhost:3000/auth/callback`

## 2. Create Database Tables

### user_data Table

```sql
CREATE TABLE public.user_data (
  id bigint primary key generated always as identity,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  generations_used integer default 0,
  is_pro_member boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own data"
  ON public.user_data
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own data"
  ON public.user_data
  FOR UPDATE
  USING (auth.uid() = user_id);
```

### generated_assets Table

```sql
CREATE TABLE public.generated_assets (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  brand_name text not null,
  asset_type text not null,
  image_url text not null,
  prompt_used text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
ALTER TABLE public.generated_assets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own assets"
  ON public.generated_assets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create assets"
  ON public.generated_assets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
  ON public.generated_assets
  FOR DELETE
  USING (auth.uid() = user_id);
```

## 3. Set Up Auth Triggers

Create a trigger to automatically create a user_data entry when a user signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_data (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 4. Environment Variables

Add these to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The service role key is needed for server-side operations like webhooks and admin functions.
