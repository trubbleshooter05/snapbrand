# Logo Generator Template — Add New Business Types

This is a **zero-code template**. Add new business types by only editing `config.ts`.

## Quick Start: Add a New Business Type

### Step 1: Open `config.ts`

Find the `BUSINESS_TYPE_CONFIG` object and add your new type:

```typescript
'restaurant': {
  label: 'Restaurant',
  keyword: 'restaurant logo generator',
  seoTitle: 'Restaurant Logo Generator - Create Professional Restaurant Logos | SNAPBRAND',
  seoDescription: 'Generate stunning restaurant logos in seconds with AI. Custom designs for cafes, fine dining, fast casual, and more. Start free today.',
  description: 'Generate professional restaurant logos that appeal to your target audience and reflect your cuisine style.',
  benefits: [
    {
      icon: '🍽️',
      title: 'Appetizing Design',
      desc: 'Create logos that make customers hungry and excited about your restaurant.',
    },
    {
      icon: '🎭',
      title: 'Brand Your Cuisine',
      desc: 'Logos tailored to your cuisine type—from fine dining to casual cafes.',
    },
    {
      icon: '📱',
      title: 'Multi-Platform Ready',
      desc: 'Perfect for menus, websites, delivery apps, and storefront signage.',
    },
    {
      icon: '✨',
      title: 'Memorable & Shareable',
      desc: 'Stand out on social media and increase word-of-mouth marketing.',
    },
  ],
  faqItems: [
    {
      q: 'Can I use this logo on my menu and website?',
      a: 'Absolutely! Pro members get a commercial license for all uses. Free users can use for personal projects.',
    },
    {
      q: 'Do you offer logos for specific cuisine types?',
      a: 'Yes! Describe your cuisine style (Italian, Asian fusion, vegan, etc.) and we\'ll tailor logos accordingly.',
    },
    {
      q: 'Can I get logos in different styles?',
      a: 'Yes, our AI generates multiple design options. Choose the one that matches your restaurant\'s vibe best.',
    },
    {
      q: 'What if I need to adjust colors or fonts?',
      a: 'Your brand kit includes all design elements. You can customize colors and fonts to match your restaurant.',
    },
    {
      q: 'How quickly can I start using my logo?',
      a: 'Instantly! Generate, download, and start using your logo within seconds—no waiting required.',
    },
  ],
},
```

### Step 2: Update `RELATED_BUSINESS_TYPES`

Add your new type to the related business types array (shown on every page):

```typescript
export const RELATED_BUSINESS_TYPES = [
  { slug: 'restaurant', label: 'Restaurant' },     // ← Add your new type here
  { slug: 'ecommerce', label: 'E-commerce' },
  { slug: 'fitness-coach', label: 'Fitness Coach' },
  { slug: 'agency', label: 'Agency' },
]
```

### Step 3: Done!

Your page is live at:
```
/logo-generator/restaurant
```

That's it. No code changes needed.

## Configuration Fields Explained

| Field | Purpose | Example |
|-------|---------|---------|
| `label` | Display name on page | "Real Estate" |
| `keyword` | SEO target keyword | "real estate logo generator" |
| `seoTitle` | Page title (50-60 chars) | "Real Estate Logo Generator..." |
| `seoDescription` | Meta description (150-160 chars) | "Generate stunning..." |
| `description` | Hero section subtitle | "Generate professional..." |
| `benefits` | 4 benefit cards (icon, title, desc) | Array of 4 items |
| `faqItems` | 5 FAQ questions | Array of {q, a} objects |

## SEO Best Practices

### Title (seoTitle)
- 50-60 characters max
- Include primary keyword at start
- Format: "[Keyword] - [Value Prop] \| SNAPBRAND"
- Example: "Real Estate Logo Generator - Create Professional Property Logos \| SNAPBRAND"

### Description (seoDescription)
- 150-160 characters max
- Lead with keyword + benefit
- Include CTA: "Start free today", "Free trial", etc.
- Example: "Generate stunning, professional real estate logos in seconds with AI. Customize colors, fonts, and styles. No design experience needed. Start free today."

### Keyword
- Primary keyword targeting this page
- Use exact phrase people search for
- Examples: "restaurant logo generator", "ecommerce logo maker", "fitness logo generator"

### Benefits (4 items)
- Icon (emoji)
- Compelling title (why this matters to this business type)
- 1-2 sentence description
- Focus on business type-specific value, not generic

### FAQ (5 items)
- Address real objections users have
- Be specific to this business type
- Keep answers concise (1-2 sentences)
- Cover: commercial use, customization, timeline, formats, guarantees

## File Structure

```
app/logo-generator/[business-type]/
├── page.tsx          (Server component, metadata only)
├── client-page.tsx   (Client component, UI & interactions)
├── config.ts         (Configuration for all business types) ← EDIT THIS
└── TEMPLATE.md       (This file)
```

### page.tsx (No changes needed)
- Imports `config.ts`
- Uses `generateMetadata()` for SEO
- Passes `businessType` to ClientPage

### client-page.tsx (No changes needed)
- Imports config via `getConfig()`
- Renders same UI for all business types
- All content is data-driven from config

### config.ts (Only file you edit)
- Define all business types
- All content lives here
- Adding type = page automatically works

## Adding Multiple Types

It's fast! Add them one at a time:

```typescript
export const BUSINESS_TYPE_CONFIG: Record<string, BusinessTypeConfig> = {
  'real-estate': { ... },
  'restaurant': { ... },
  'ecommerce': { ... },
  'fitness-coach': { ... },
  'agency': { ... },
  'consulting': { ... },
  'saas': { ... },
  // ... as many as you want
}
```

Each entry = one new page, automatically.

## Testing New Types

1. Add config entry
2. Navigate to `/logo-generator/your-new-type`
3. Check:
   - Page title (view source, look for `<title>`)
   - Meta description
   - H1 contains keyword
   - Benefits display correctly
   - FAQ shows your questions
   - Form works

## Scaling Strategy

### Phase 1: Test with 2-3 types
- real-estate (done)
- restaurant
- ecommerce

### Phase 2: Add high-traffic types
- fitness-coach
- agency
- consulting

### Phase 3: Cover the long tail
- Add 20+ niche types
- Each gets organic traffic from long-tail keywords

### Phase 4: Create brand-kit pages
- `/brand-kit/[business-type]` using same pattern
- Reuse config for consistency

## Pro Tips

1. **Keyword Research**: Use Google Keyword Planner or Ahrefs to find search volume before adding types
2. **Benefit Specificity**: Generic benefits (fast, easy) don't convert. Focus on business-specific pain points
3. **FAQ Testing**: Monitor analytics to see which questions users ask most in your support, add those to FAQ
4. **Emoji Selection**: Choose icons that clearly represent the industry
5. **Internal Linking**: Related business types at bottom of page help SEO and discovery
6. **Mobile Testing**: All business types use same responsive layout—test once, works everywhere
7. **A/B Testing**: Test different CTAs, button copy, form fields without changing config

## Examples

### E-commerce
```typescript
'ecommerce': {
  label: 'E-commerce',
  keyword: 'ecommerce logo generator',
  seoTitle: 'E-commerce Logo Generator - Create Stunning Store Logos | SNAPBRAND',
  seoDescription: 'Generate professional e-commerce logos in seconds with AI. Custom designs for online shops, marketplaces, and digital stores. Start free today.',
  description: 'Generate professional e-commerce logos that build customer trust and drive conversions.',
  benefits: [
    {
      icon: '🛍️',
      title: 'Increase Customer Trust',
      desc: 'A professional logo makes your online store look established and trustworthy.',
    },
    {
      icon: '📦',
      title: 'Stand Out on Marketplaces',
      desc: 'Get noticed on Amazon, eBay, Shopify, and social media platforms.',
    },
    {
      icon: '🎯',
      title: 'Convert Browsers to Buyers',
      desc: 'Professional branding increases perceived value and encourages purchases.',
    },
    {
      icon: '🔄',
      title: 'Scale Your Brand',
      desc: 'Use consistent logos across all sales channels for brand recognition.',
    },
  ],
  faqItems: [
    // ... 5 FAQ items specific to e-commerce
  ],
}
```

### Fitness Coach
```typescript
'fitness-coach': {
  label: 'Fitness Coach',
  keyword: 'fitness logo generator',
  seoTitle: 'Fitness Logo Generator - Create Professional Coach Logos | SNAPBRAND',
  seoDescription: 'Generate stunning fitness coach logos in seconds with AI. Perfect for personal trainers, gyms, and fitness influencers. Start free today.',
  description: 'Generate professional fitness logos that motivate clients and build your personal brand.',
  benefits: [
    {
      icon: '💪',
      title: 'Motivate Your Clients',
      desc: 'A powerful logo conveys strength, energy, and transformation.',
    },
    {
      icon: '📱',
      title: 'Perfect for Social Media',
      desc: 'Professional logos look great on Instagram, TikTok, and YouTube.',
    },
    {
      icon: '🏆',
      title: 'Establish Authority',
      desc: 'Build credibility with potential clients through professional branding.',
    },
    {
      icon: '💼',
      title: 'Scale Your Coaching Business',
      desc: 'Use across programs, apps, merchandise, and marketing materials.',
    },
  ],
  faqItems: [
    // ... 5 FAQ items specific to fitness coaches
  ],
}
```

## Troubleshooting

**Q: Page doesn't appear at URL**
A: Did you add the type to `BUSINESS_TYPE_CONFIG`? Make sure the slug matches the URL exactly.

**Q: Content isn't showing**
A: Check config.ts for syntax errors (missing commas, quotes). All fields are required.

**Q: SEO title/description not updating**
A: Changes to config are reflected immediately. Hard refresh browser (Cmd+Shift+R).

**Q: Benefits/FAQ not displaying**
A: Make sure arrays have exactly 4 benefits and 5 FAQ items. Missing items? Page may not render correctly.

**Q: Want to customize UI beyond config?**
A: Edit `client-page.tsx`. Any changes apply to all business types automatically. This is powerful for A/B testing!

## Next Steps

1. ✅ Add 5-10 high-traffic business types
2. ✅ Monitor analytics for search traffic
3. ✅ Create `/brand-kit/[business-type]` pages
4. ✅ Set up keyword tracking for each type
5. ✅ Create landing page linking all types
6. ✅ Build internal linking strategy
7. ✅ Create comparison content (type vs. type)

---

**Questions?** See `LOGO_GENERATOR_SETUP.md` for full architecture details.
