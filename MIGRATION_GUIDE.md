# Migration from Supabase to Prisma + PostgreSQL

This guide explains what changed when we migrated from Supabase to Prisma + PostgreSQL.

## What Changed

### Authentication
- **Before**: Supabase Auth
- **After**: NextAuth.js + Credentials provider + Google OAuth
- **Benefit**: Full control, no vendor lock-in, NextAuth is Next.js native

### Database
- **Before**: Supabase managed PostgreSQL
- **After**: Prisma ORM + PostgreSQL (self-managed or Railway/Render)
- **Benefit**: Type-safe queries, easier migrations, better performance

### API Routes
- **Before**: Direct Supabase client in components
- **After**: Server-side API routes with NextAuth session
- **Benefit**: Better security, centralized data access

## File Changes Summary

### Removed/Replaced Files
- `lib/supabase.ts` → `lib/prisma.ts` (Prisma client)
- `app/providers.tsx` (old Supabase context) → (new NextAuth SessionProvider)
- `.env` Supabase variables → PostgreSQL + NextAuth variables

### New Files
- `lib/auth.ts` - NextAuth configuration
- `lib/db.ts` - Database query helpers
- `lib/prisma.ts` - Prisma client singleton
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API
- `app/api/auth/register/route.ts` - Email/password registration
- `prisma/schema.prisma` - Database schema

### Updated Files
- All API routes now use `getServerSession` from NextAuth
- All components use `useSession` from NextAuth
- Database queries use Prisma instead of Supabase
- Environment variables completely different

## Data Structure Changes

### User Model

**Before (Supabase)**:
```javascript
// Data was in multiple tables
user_data {
  user_id, email, generations_used, is_pro_member
}
auth.users {
  id, email, ...
}
```

**After (Prisma)**:
```prisma
model User {
  id String @id
  email String @unique
  generationsUsed Int
  isProMember Boolean
  stripeCustomerId String?
  stripeSubscriptionId String?
  accounts Account[]
  sessions Session[]
  generatedAssets GeneratedAsset[]
}
```

All user data is in one `User` table.

### Generated Assets

**Before (Supabase)**:
```sql
generated_assets {
  id, user_id, brand_name, asset_type, image_url, prompt_used
}
```

**After (Prisma)**:
```prisma
model GeneratedAsset {
  id String @id
  userId String
  brandName String
  assetType String
  imageUrl String
  promptUsed String
  createdAt DateTime
  updatedAt DateTime
  user User @relation(...)
}
```

Nearly identical, but with built-in timestamps.

## Database Provider Options

### Development (Local)
```bash
DATABASE_URL="postgresql://localhost:5432/snapbrand"
```

### Production Options

**Railway** (Recommended - $5/month)
```
DATABASE_URL="postgresql://user:pass@railway.app:5432/snapbrand"
```

**Render** (Free tier available)
```
DATABASE_URL="postgresql://user:pass@your-render-instance.onrender.com/snapbrand"
```

**Fly.io** (Free tier available)
```
DATABASE_URL="postgresql://user:pass@your-instance.fly.dev/snapbrand"
```

**AWS RDS** (Pay-as-you-go)
```
DATABASE_URL="postgresql://user:pass@rds.amazonaws.com/snapbrand"
```

## Authentication Flow Changes

### Email/Password
- **Before**: Supabase handled all auth
- **After**: NextAuth credential provider with custom validation

### Google OAuth
- **Before**: Supabase OAuth integration
- **After**: NextAuth Google provider

### Session Management
- **Before**: Supabase session in localStorage
- **After**: NextAuth session in httpOnly cookies (more secure)

## Environment Variables

### Removed (Supabase)
```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Added (Prisma + NextAuth)
```bash
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

## Cost Comparison

| Feature | Supabase | Prisma + Railway |
|---------|----------|------------------|
| Database | Free tier (500 MB) | Free tier (10 GB) |
| Auth | Included | Free (NextAuth) |
| Storage | $5/mo per GB | -  |
| Cost for small app | Free - $25 | Free - $5 |
| **Verdict** | Lower cost at scale | Better for small projects |

## Benefits of Prisma

✅ Type-safe database queries  
✅ Automatic migrations  
✅ Works with any PostgreSQL host  
✅ Excellent TypeScript support  
✅ Built-in seeding tools  
✅ Database UI (Prisma Studio)  

## Benefits of NextAuth

✅ Next.js native  
✅ Open source  
✅ httpOnly cookies (more secure than localStorage)  
✅ Multiple providers (Google, GitHub, Discord, etc.)  
✅ Built-in CSRF protection  
✅ Works with any database  

## Migration Checklist

- [ ] Create PostgreSQL database
- [ ] Set DATABASE_URL in `.env.local`
- [ ] Run `npx prisma db push`
- [ ] Create Google OAuth app
- [ ] Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- [ ] Generate NEXTAUTH_SECRET
- [ ] Test email/password signup
- [ ] Test Google OAuth
- [ ] Verify data in `npx prisma studio`

## Staying in Sync

### When you change the schema

1. Edit `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name describe_changes`
3. This creates a migration file
4. Changes are applied to database

### Deployment

Vercel automatically runs migrations on deploy, so you just push your code!

## Common Issues

### "table "User" does not exist"
- Run: `npx prisma db push`

### "Foreign key constraint failed"
- Ensure records exist in related tables
- Check: `npx prisma studio`

### Google OAuth fails
- Verify redirect URI: `http://localhost:3000/api/auth/callback/google`
- Check credentials in Google Cloud Console

## Questions?

See [PRISMA_SETUP.md](./PRISMA_SETUP.md) for detailed setup guide.
