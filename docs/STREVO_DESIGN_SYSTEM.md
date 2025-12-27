# Strevo Design System — "Minimal Precision"

Premium luxury streetwear e-commerce design system.

---

## 1. Theme Specification

### Color Palette

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| `bg` | `#0B0B0B` | `bg-strevo-bg` | Primary background |
| `surface` | `#111214` | `bg-strevo-surface` | Cards, modals, elevated surfaces |
| `accent` | `#2B3A8C` | `bg-strevo-accent` | CTAs, links, brand highlights |
| `muted` | `#B7B9BD` | `text-strevo-muted` | Secondary text, placeholders |
| `highlight` | `#FAFAFA` | `text-strevo-highlight` | Primary text, CTA text |
| `gold` | `#D4AF37` | `text-strevo-gold` | Success states, premium accents (sparingly) |

### Typography

| Element | Font | Weight | Size (Desktop) | Tailwind Class |
|---------|------|--------|----------------|----------------|
| H1 | Neue Montreal | 700 | 48-56px | `font-display text-5xl md:text-7xl` |
| H2 | Neue Montreal | 600 | 36px | `font-display text-3xl md:text-4xl` |
| H3 | Neue Montreal | 600 | 28px | `font-display text-2xl` |
| Body | Helvetica Now | 400 | 16px | `font-ui text-base` |
| Small | Helvetica Now | 400 | 14px | `font-ui text-sm` |
| Caption | Helvetica Now | 500 | 12px | `font-ui text-xs tracking-widest uppercase` |

### Spacing Scale

Base unit: `8px`

| Token | Value | Tailwind |
|-------|-------|----------|
| `xs` | 8px | `p-2`, `m-2` |
| `sm` | 16px | `p-4`, `m-4` |
| `md` | 24px | `p-6`, `m-6` |
| `lg` | 32px | `p-8`, `m-8` |
| `xl` | 48px | `p-12`, `m-12` |
| `2xl` | 64px | `p-16`, `m-16` |
| `3xl` | 96px | `p-24`, `m-24` |

### Grid System

- Desktop (1200-1600px): 4 columns
- Tablet (768-1199px): 2-3 columns
- Mobile (<768px): 1-2 columns
- Max container: `max-w-7xl` (1280px)

---

## 2. Animation System

### Duration Tokens

| Type | Duration | Tailwind | Use Case |
|------|----------|----------|----------|
| `micro` | 120-150ms | `duration-micro` | Buttons, hovers, toggles |
| `short` | 200ms | `duration-200` | Quick transitions |
| `medium` | 300ms | `duration-medium` | Reveals, modals, menus |
| `long` | 600ms | `duration-long` | Hero, Lottie, page transitions |

### Easing Functions

```css
/* Premium entrance - use for most animations */
--ease-premium: cubic-bezier(0.19, 1, 0.22, 1);

/* Standard exit */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Bounce (micro interactions) */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Tailwind classes: `ease-premium`, `ease-bounce-subtle`

### Framer Motion Variants

Import from `@/lib/animations/variants`:

```tsx
import { 
  fadeUp,           // Primary entrance
  fadeIn,           // Simple opacity
  scaleIn,          // Modals/popovers
  slideRight,       // Drawers
  slideLeft,        // Sidebars
  staggerContainer, // List containers
  staggerItem,      // List items
  heroHeading,      // Hero H1
  heroSubtitle,     // Hero subtitle
  heroCTA,          // Hero buttons
  megaMenuContainer,// Mega menu
  productCardHover, // Card lift effect
  productImageHover,// Image zoom
  buttonTap,        // Button press
  heartBounce,      // Wishlist animation
  toastSlide,       // Toast notifications
  backdropFade,     // Modal backdrops
  accordionContent, // Accordion expand
  crossfade,        // Image galleries
} from '@/lib/animations/variants'
```

### Reduced Motion

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. Component Library

### Available Components

Import from `@/components/strevo`:

```tsx
import {
  HeroBanner,
  StrevoProductCard,
  StrevoProductGrid,
  SectionHeader,
  CategoryCard,
  CategoryGrid,
  FeatureSection,
  LookbookGrid,
} from '@/components/strevo'
```

### Component Priority List

#### High Priority (Week 1) ✅
- [x] HeroBanner
- [x] StrevoProductCard
- [x] StrevoProductGrid
- [x] SectionHeader
- [x] CategoryGrid
- [x] FeatureSection
- [x] LookbookGrid
- [ ] TopNav (existing, needs theme update)
- [ ] MobileDrawer (existing)
- [ ] Footer (existing)

#### Medium Priority (Week 2)
- [ ] MegaMenu (existing, needs animation update)
- [ ] SidebarFilters
- [ ] SearchBar + SearchSuggest
- [ ] CartDrawer
- [ ] QuickViewModal
- [ ] FilterChips
- [ ] RelatedProductsCarousel

#### Low Priority (Week 3+)
- [ ] EditorialStrip
- [ ] BannerPromo
- [ ] NewsletterSignup
- [ ] Reviews/Ratings
- [ ] OrderSuccess animation

---

## 4. Component Usage Examples

### HeroBanner

```tsx
<HeroBanner
  tagline="Technical Performance Wear"
  headline="Defined by\nPrecision"
  primaryCTA={{ label: "Shop Men", href: "/products?category=men" }}
  secondaryCTA={{ label: "Shop Women", href: "/products?category=women" }}
  videoSrc="/hero-video.mp4"
  overlayOpacity={0.6}
/>
```

### Product Grid

```tsx
<SectionHeader 
  title="New Arrivals" 
  viewAllHref="/products" 
/>
<StrevoProductGrid 
  products={products} 
  isLoading={isLoading}
  columns={4}
/>
```

### Category Grid

```tsx
<CategoryGrid
  categories={[
    { name: "Men", image: "/men.webp", href: "/products?category=men" },
    { name: "Women", image: "/women.webp", href: "/products?category=women" },
    { name: "Accessories", image: "/acc.webp", href: "/products?category=accessories" },
  ]}
/>
```

### Feature Section

```tsx
<FeatureSection
  tagline="System 01 / Essentials"
  headline="Engineered for the Modern Generation"
  description={[
    "At Strevo, we design apparel that blends comfort, performance, and modern aesthetics.",
    "From long days to late nights, Strevo adapts to your rhythm."
  ]}
  features={[
    { title: "Breathable", description: "Advanced airflow technology" },
    { title: "Durable", description: "Reinforced construction" },
    { title: "Sweat Resistant", description: "Moisture-wicking fabric" },
  ]}
  imageSrc="/feature-image.jpg"
  imageAlt="Strevo technical wear"
  ctaLabel="Explore Fabric Technology"
  ctaHref="/about"
/>
```

### Lookbook Grid

```tsx
<LookbookGrid
  items={[
    {
      imageSrc: "/lookbook-1.jpg",
      imageAlt: "Lookbook image",
      ctaLabel: "To See",
      ctaHref: "/products",
      caption: "New beanies available in 3 colors"
    },
    // ...more items
  ]}
/>

{/* With video split */}
<LookbookGrid
  layout="split-video"
  videoSrc="/promo-video.mp4"
  items={[{ imageSrc: "/image.jpg", imageAlt: "..." }]}
/>
```

---

## 5. Image Guidelines

### Dimensions

| Type | Source | Serve | Format |
|------|--------|-------|--------|
| Hero/Campaign | 3000px wide | 1920/1280/640 | WebP/AVIF |
| Product Thumbnail | 800×800 | 400×400, 320×320 | WebP |
| Product Gallery | 1600-2000px | srcset responsive | WebP |
| Search Thumbnail | 80×80 | 64×64 | WebP |
| Mega-menu Preview | 400×400 | 200×200 | WebP |
| Social (OG) | 1200×628 | — | JPEG |

### CDN Path Structure

```
/images/products/{sku}/hero.webp
/images/products/{sku}/thumb-400.webp
/images/products/{sku}/thumb-80.webp
/images/products/{sku}/gallery-{n}.webp
```

### Product Image Metadata

```typescript
interface ProductImage {
  thumbnail_url: string;      // 64-80px
  gallery_urls: string[];     // responsive sizes
  placeholder: string;        // base64 LQIP or hex color
  alt_text: string;           // descriptive
}
```

### Image Best Practices

- Use `loading="lazy"` for below-fold images
- Mark hero/above-fold images as `priority`
- Always provide descriptive `alt` text
- Use LQIP (Low Quality Image Placeholder) for perceived performance
- Serve WebP with JPEG fallback

---

## 6. Tailwind Configuration

The theme is configured in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        strevo: {
          bg: '#0B0B0B',
          surface: '#111214',
          accent: '#2B3A8C',
          muted: '#B7B9BD',
          highlight: '#FAFAFA',
          gold: '#D4AF37',
        },
      },
      fontFamily: {
        display: ['Neue Montreal', 'Monument Extended', 'ui-sans-serif'],
        ui: ['Helvetica Now Display', 'Akzidenz Grotesk', 'ui-sans-serif'],
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        'micro': '150ms',
        'medium': '300ms',
        'long': '600ms',
      },
    },
  },
}
```

---

## 7. Performance Checklist

- [x] Images: responsive srcset, loading="lazy", priority for above-fold
- [x] Fonts: preload critical, system fallback stack
- [ ] JS: code-split carousels, mega-menu, modals
- [ ] FMP target: < 1.2s on 4G mobile
- [ ] LCP target: < 2.5s
- [ ] CLS target: < 0.1

---

## 8. Accessibility Checklist

- [x] Color contrast: 4.5:1 minimum for text
- [x] Focus states: visible outline on all interactive elements
- [x] Keyboard navigation: all controls focusable
- [x] ARIA labels: buttons, images, form inputs
- [x] Alt text: all product images
- [x] Reduced motion: animations disabled when preferred

---

## 9. Animation Mapping

| Component | Animation | Variant |
|-----------|-----------|---------|
| Hero headings | Fade + slide-up | `heroHeading` |
| Hero background | Subtle parallax | CSS/useTransform |
| Mega-menu columns | Fade + scale | `megaMenuContainer` |
| Product cards | Staggered fade-up | `staggerContainer` + `staggerItem` |
| Product card hover | Lift + shadow | `productCardHover` |
| Product image hover | Subtle zoom | `productImageHover` |
| Quick-add button | Micro bounce | `buttonTap` |
| Wishlist heart | Spring bounce | `heartBounce` |
| Filters opening | Slide + fade | `slideRight` |
| Cart drawer | Slide from right | `slideRight` + `backdropFade` |
| Toasts | Slide from bottom | `toastSlide` |
| Search suggestions | Instant fade | `fadeIn` |

---

## 10. File Structure

```
components/
├── strevo/
│   ├── index.ts              # Exports
│   ├── hero-banner.tsx       # Hero section
│   ├── product-card.tsx      # Product card with animations
│   ├── product-grid.tsx      # Animated product grid
│   ├── section-header.tsx    # Section titles
│   ├── category-card.tsx     # Category cards + grid
│   ├── feature-section.tsx   # Feature/about section
│   └── lookbook-grid.tsx     # Editorial lookbook
│
lib/
├── animations/
│   └── variants.ts           # Framer Motion variants
│
styles/
└── globals.css               # Font faces, CSS variables
```
