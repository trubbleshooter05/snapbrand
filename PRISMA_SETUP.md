# Prisma + PostgreSQL Setup Guide

This guide will help you set up Prisma and PostgreSQL for SNAPBRAND.

## 1. Choose a PostgreSQL Database Provider

### Option A: Local PostgreSQL (Development)

```bash
# Install PostgreSQL locally (macOS)
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create a database
createdb snapbrand

# Set DATABASE_URL in .env.local
DATABASE_URL="postgresql://localhost:5432/snapbrand"
```

### Option B: Railway (Free Tier + $5/month)

1. Go to [railway.app](https://railway.app)
2. Sign up and create a new project
3. Add PostgreSQL plugin
4. Copy the DATABASE_URL from the PostgreSQL plugin
5. Add to `.env.local`

**Railway is recommended** - free tier + simple setup

### Option C: Render (Free Tier)

1. Go to [render.com](https://render.com)
2. Create a new PostgreSQL database
3. Copy the external database URL
4. Add to `.env.local`

### Option D: Fly.io

1. Go to [fly.io](https://fly.io)
2. Create PostgreSQL instance
3. Get connection string
4. Add to `.env.local`

## 2. Set Up Environment Variables

Copy the example file:
```bash
cp .env.local.example .env.local
```

Fill in your database URL:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/snapbrand
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

### Generate NEXTAUTH_SECRET

```bash
# Generate a random secret
openssl rand -base64 32
```

## 3. Run Database Migrations

Initialize Prisma and push schema to database:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push
```

## 4. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - Your production domain
6. Copy Client ID and Secret to `.env.local`

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

## 5. Verify Database Setup

```bash
# Open Prisma Studio to view/manage data
npx prisma studio
```

This opens a UI at `http://localhost:5555` where you can:
- View all database tables
- Create/edit/delete records
- Run queries

## 6. Run Application

```bash
npm run dev
```

Visit `http://localhost:3000` and test:
1. Sign up with email/password
2. Login
3. Test Google OAuth
4. Check user data in Prisma Studio

## Prisma Commands Reference

```bash
# View database
npx prisma studio

# Create migration (after schema changes)
npx prisma migrate dev --name describe_changes

# Reset database (delete all data)
npx prisma migrate reset

# Pull schema from existing database
npx prisma db pull

# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push
```

## Troubleshooting

### Connection Refused
- Verify DATABASE_URL is correct
- Check PostgreSQL is running: `psql -U postgres`
- Verify database exists: `psql -l`

### Migration Conflicts
```bash
# Reset database and reapply migrations
npx prisma migrate reset
```

### Prisma Client Issues
```bash
# Regenerate client
npx prisma generate
```

### Google OAuth Not Working
- Verify CLIENT_ID and SECRET match Google Cloud Console
- Check redirect URIs are correct
- Ensure `NEXTAUTH_URL` matches your app domain

## Production Deployment

When deploying to Vercel/production:

1. Add DATABASE_URL to environment variables
2. Run migrations on deployment:
   ```bash
   npx prisma migrate deploy
   ```
3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
4. Update NEXTAUTH_URL to production domain
5. Update Google OAuth redirect URIs in Google Cloud Console
6. Update Stripe and OpenAI credentials

## Useful Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Railway PostgreSQL Guide](https://docs.railway.app/databases/postgresql)
