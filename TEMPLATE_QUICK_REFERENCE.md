# Logo Generator Template — Quick Reference

**Location:** `app/logo-generator/[business-type]/config.ts`

**What to do:** Add a new entry to `BUSINESS_TYPE_CONFIG`, update `RELATED_BUSINESS_TYPES`.

---

## 60-Second Add New Type

1. Open `config.ts`
2. Find the template (commented-out entry at bottom)
3. Uncomment and fill in these 7 fields:

| Field | What | Length |
|-------|------|--------|
| `label` | Display name | "Fitness Coach" |
| `keyword` | SEO target | "fitness coach logo generator" |
| `seoTitle` | Browser tab title | 50-60 chars |
| `seoDescription` | Google snippet | 150-160 chars |
| `description` | Hero subtitle | 1-2 sentences |
| `benefits` | 4 cards (icon, title, desc) | Exactly 4 |
| `faqItems` | 5 Q&A items | Exactly 5 |

4. Add slug to `RELATED_BUSINESS_TYPES` array
5. Save → Page lives at `/logo-generator/your-slug`

Done!

---

## Copy-Paste Template

```typescript
'your-slug': {
  label: 'Your Label',
  keyword: 'your keyword logo generator',
  seoTitle: 'Your Label Logo Generator - [Benefit] | SNAPBRAND',
  seoDescription: 'Generate [your label] logos in seconds with AI. [Feature]. Start free today.',
  description: 'Generate professional [your label] logos that [value].',
  benefits: [
    {
      icon: '🎯',
      title: 'Benefit 1',
      desc: 'Description of why this matters for your industry.',
    },
    {
      icon: '⚡',
      title: 'Benefit 2',
      desc: 'Another key benefit description.',
    },
    {
      icon: '🚀',
      title: 'Benefit 3',
      desc: 'Third benefit description.',
    },
    {
      icon: '✨',
      title: 'Benefit 4',
      desc: 'Fourth benefit description.',
    },
  ],
  faqItems: [
    { q: 'Q1?', a: 'A1 here.' },
    { q: 'Q2?', a: 'A2 here.' },
    { q: 'Q3?', a: 'A3 here.' },
    { q: 'Q4?', a: 'A4 here.' },
    { q: 'Q5?', a: 'A5 here.' },
  ],
},
```

---

## File Structure

```
app/logo-generator/[business-type]/
├── config.ts         ← EDIT THIS (add new types here)
├── page.tsx          (server component, don't touch)
├── client-page.tsx   (UI component, don't touch)
└── TEMPLATE.md       (full guide)
```

---

## What Happens Automatically

When you add a type to `config.ts`:

- ✅ URL works: `/logo-generator/your-slug`
- ✅ SEO title & description set
- ✅ H1 targeted to keyword
- ✅ Benefits displayed as 4 cards
- ✅ FAQ displayed with 5 Q&A
- ✅ Related types shown
- ✅ Form works
- ✅ Mobile responsive

**Zero code changes needed.**

---

## Examples

### Fitness Coach
```typescript
'fitness-coach': {
  label: 'Fitness Coach',
  keyword: 'fitness coach logo generator',
  seoTitle: 'Fitness Coach Logo Generator - Create Professional Coach Logos | SNAPBRAND',
  seoDescription: 'Generate stunning fitness logos for trainers and coaches in seconds with AI. Mobile-optimized, customizable designs. Start free today.',
  description: 'Generate professional fitness logos that motivate clients and build your personal brand.',
  benefits: [
    { icon: '💪', title: 'Motivate Your Clients', desc: 'Powerful logos convey strength and transformation.' },
    { icon: '📱', title: 'Perfect for Social Media', desc: 'Looks great on Instagram, TikTok, and YouTube.' },
    { icon: '🏆', title: 'Establish Authority', desc: 'Build credibility with potential clients.' },
    { icon: '💼', title: 'Scale Your Business', desc: 'Use across programs, apps, and marketing.' },
  ],
  faqItems: [
    { q: 'Can I use for my online courses?', a: 'Yes, Pro plan includes commercial license.' },
    { q: 'Do you offer trainer-specific styles?', a: 'Yes, describe your niche and we tailor logos.' },
    { q: 'Can I modify colors?', a: 'Absolutely, your brand kit is fully customizable.' },
    { q: 'How fast do I get results?', a: 'Instantly generated, download within seconds.' },
    { q: 'Money-back guarantee?', a: 'Yes, 7-day guarantee on Pro plans.' },
  ],
},
```

### E-commerce
```typescript
'ecommerce': {
  label: 'E-commerce Store',
  keyword: 'ecommerce logo generator',
  seoTitle: 'E-commerce Logo Generator - Create Store Logos | SNAPBRAND',
  seoDescription: 'Generate professional e-commerce logos for online shops in seconds with AI. Perfect for Shopify, Amazon, and marketplaces. Start free today.',
  description: 'Generate professional e-commerce logos that build trust and drive conversions.',
  benefits: [
    { icon: '🛍️', title: 'Increase Customer Trust', desc: 'Professional logos make stores look established.' },
    { icon: '📦', title: 'Stand Out on Marketplaces', desc: 'Get noticed on Amazon, eBay, Shopify.' },
    { icon: '🎯', title: 'Drive Conversions', desc: 'Professional branding increases perceived value.' },
    { icon: '🔄', title: 'Scale Your Brand', desc: 'Consistent logos across all sales channels.' },
  ],
  faqItems: [
    { q: 'Works on Shopify and WooCommerce?', a: 'Yes, works on all e-commerce platforms.' },
    { q: 'Can I use on marketplace listings?', a: 'Absolutely, Pro plan allows commercial use.' },
    { q: 'Do you handle product-specific logos?', a: 'Yes, describe your products and niche.' },
    { q: 'What file formats?', a: 'PNG free, PNG + SVG + more on Pro.' },
    { q: 'Satisfaction guarantee?', a: '7-day money-back, no questions asked.' },
  ],
},
```

### Consulting
```typescript
'consulting': {
  label: 'Consulting Firm',
  keyword: 'consulting logo generator',
  seoTitle: 'Consulting Logo Generator - Create Professional Logos | SNAPBRAND',
  seoDescription: 'Generate professional consulting logos in seconds with AI. Perfect for strategy, management, and business consultants. Start free today.',
  description: 'Generate professional consulting logos that convey expertise and trustworthiness.',
  benefits: [
    { icon: '🎯', title: 'Convey Expertise', desc: 'Professional logos build credibility instantly.' },
    { icon: '📊', title: 'Client Confidence', desc: 'Logos signal that you\'re a serious professional.' },
    { icon: '🤝', title: 'Win More Contracts', desc: 'Better branding = better impression = more deals.' },
    { icon: '📈', title: 'Grow Your Firm', desc: 'Consistent branding across all client touchpoints.' },
  ],
  faqItems: [
    { q: 'Can I use for my pitch deck?', a: 'Yes, perfect for presentations and proposals.' },
    { q: 'Work on LinkedIn and website?', a: 'Absolutely, optimized for all digital platforms.' },
    { q: 'Does it look corporate?', a: 'Yes, tailored to consulting industry standards.' },
    { q: 'Can I customize to my specialty?', a: 'Yes, describe your consulting focus and niche.' },
    { q: 'How is it different from DIY tools?', a: 'AI creates professional logos in seconds, not hours.' },
  ],
},
```

---

## SEO Checklist

For each new type, verify:

- [ ] `keyword` is what people actually search
- [ ] `seoTitle` includes keyword at start
- [ ] `seoTitle` is 50-60 characters
- [ ] `seoDescription` includes keyword + CTA
- [ ] `seoDescription` is 150-160 characters
- [ ] `benefits` are specific to industry (not generic)
- [ ] `faqItems` address real objections
- [ ] All 7 fields are filled in
- [ ] No syntax errors (missing commas, quotes)

---

## Scaling Plan

### Month 1: Build Foundation
- [x] Real Estate (done)
- [ ] Restaurant
- [ ] E-commerce
- [ ] Fitness Coach

### Month 2: Add High Volume
- [ ] Consulting
- [ ] Agency
- [ ] SaaS
- [ ] Healthcare

### Month 3: Long Tail
- [ ] 10+ more niche types
- [ ] Monitor analytics
- [ ] Double down on winners

### Month 4+
- [ ] Create `/brand-kit/[type]` pages
- [ ] Build internal linking strategy
- [ ] Create comparison content
- [ ] Launch paid ads to top performers

---

## Quick Links

- **Full guide:** `ADD_NEW_BUSINESS_TYPE.md`
- **Template details:** `app/logo-generator/[business-type]/TEMPLATE.md`
- **Architecture:** `LOGO_GENERATOR_SETUP.md`

---

## That's It!

You now have a scalable system for unlimited pages. Just add to `config.ts` and you're done.

Happy scaling! 🚀
