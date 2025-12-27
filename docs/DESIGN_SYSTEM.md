# Thrift_ind Design System - AJIO Style

## 🎨 Design Philosophy

**Premium • Clean • Minimal • Fashion-Forward • Highly Visual**

Inspired by AJIO's modern e-commerce aesthetic with emphasis on:
- Large, high-quality product imagery
- Clean typography and generous whitespace
- Subtle animations and micro-interactions
- Mobile-first responsive design
- Accessibility and usability

---

## 📐 Spacing System

```css
XS = 4px   (0.25rem)  /* Tight spacing, borders */
SM = 8px   (0.5rem)   /* Small gaps, padding */
MD = 16px  (1rem)     /* Default spacing */
LG = 24px  (1.5rem)   /* Section spacing */
XL = 32px  (2rem)     /* Large sections */
```

### Usage Examples
```tsx
<div className="p-4">      {/* padding: 16px (MD) */}
<div className="gap-2">    {/* gap: 8px (SM) */}
<div className="mb-6">     {/* margin-bottom: 24px (LG) */}
```

---

## 🎨 Color Palette

### Primary Colors
```css
Black:     #000000  /* Primary text, buttons */
White:     #FFFFFF  /* Background, contrast */
Neutral:   #F5F5F5  /* Light backgrounds */
```

### Accent Colors
```css
Primary:   #000000  /* CTA buttons */
Success:   #16A34A  /* Confirmations, available */
Warning:   #EAB308  /* Alerts */
Error:     #DC2626  /* Errors, sold out */
```

### Text Colors
```css
Foreground:      #0A0A0A  /* Primary text */
Muted:           #737373  /* Secondary text */
Muted-Light:     #A3A3A3  /* Tertiary text */
```

---

## 📝 Typography

### Font Family
```css
Primary: system-ui, -apple-system, sans-serif
Mono: 'Courier New', monospace (for codes, prices)
```

### Font Sizes
```css
xs:   12px  /* Labels, captions */
sm:   14px  /* Body text, descriptions */
base: 16px  /* Default text */
lg:   18px  /* Subheadings */
xl:   20px  /* Section titles */
2xl:  24px  /* Page titles */
3xl:  30px  /* Hero text */
4xl:  36px  /* Large hero */
```

### Font Weights
```css
normal:   400  /* Body text */
medium:   500  /* Emphasis */
semibold: 600  /* Subheadings */
bold:     700  /* Headings, prices */
```

### Line Heights
```css
tight:    1.25  /* Headings */
normal:   1.5   /* Body text */
relaxed:  1.75  /* Long-form content */
```

---

## 🧩 Component Specifications

### Product Card
```tsx
<div className="group">
  {/* Image Container */}
  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
    <Image className="object-cover group-hover:scale-105 transition-transform duration-300" />
  </div>
  
  {/* Product Info */}
  <div className="mt-3 space-y-1">
    <p className="text-xs uppercase tracking-wider text-muted-foreground">
      BRAND
    </p>
    <h3 className="font-medium group-hover:text-primary transition-colors">
      Product Name
    </h3>
    <p className="text-lg font-bold">₹1,299</p>
  </div>
</div>
```

### Button Styles
```tsx
/* Primary Button */
<Button className="bg-black text-white hover:bg-neutral-800 rounded-none px-8 py-6">
  Add to Bag
</Button>

/* Secondary Button */
<Button variant="outline" className="border-black hover:bg-black hover:text-white rounded-none">
  Wishlist
</Button>

/* Ghost Button */
<Button variant="ghost" className="hover:bg-neutral-100">
  View Details
</Button>
```

### Size Selector
```tsx
<button className={cn(
  "px-6 py-3 border text-sm font-medium transition-all",
  selected ? "border-black bg-black text-white" : "border-neutral-300 hover:border-black",
  !available && "border-neutral-200 text-neutral-300 cursor-not-allowed line-through"
)}>
  M
</button>
```

---

## ✨ Animations & Micro-interactions

### 1. Product Hover Zoom
```css
.product-hover-zoom {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.product-hover-zoom:hover {
  transform: scale(1.05);
}
```

**Usage:**
```tsx
<Image className="product-hover-zoom" />
```

### 2. Wishlist Heart Animation
```tsx
<Heart className={cn(
  "h-5 w-5 transition-all",
  isWishlisted && "fill-red-500 text-red-500 animate-ping"
)} />
```

### 3. Button Press Feedback
```tsx
<Button className="active:scale-95 transition-transform">
  Click Me
</Button>
```

### 4. Smooth Cart Drawer Slide-in
```tsx
<div className="animate-slide-in-right">
  {/* Cart content */}
</div>
```

### 5. Category Hover Highlight
```tsx
<Link className="category-hover">
  Category Name
</Link>
```

### 6. Page Fade Transitions
```tsx
<div className="animate-fade-in">
  {/* Page content */}
</div>
```

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

### Mobile-First Approach
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

---

## 🖼️ Product Detail Page (PDP) Layout

### Desktop Layout
```
┌─────────────────────────────────────────────────────┐
│  [Image Gallery]  │  Product Info                   │
│                   │  - Brand & Title                │
│  [Thumbnails]     │  - Reviews (★★★★☆)             │
│                   │  - Price (Discount Badge)       │
│                   │  - Description                  │
│                   │  - Size Selector                │
│                   │  - [Add to Bag] [♥]            │
│                   │  - Offers Section               │
│                   │  - Pincode Checker              │
└─────────────────────────────────────────────────────┘
│  Similar Products Carousel                          │
└─────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────┐
│  Image Gallery  │
│  (Swipeable)    │
├─────────────────┤
│  Product Info   │
│  - Title        │
│  - Price        │
│  - Size         │
│  - [Add to Bag] │
│  - Offers       │
│  - Pincode      │
├─────────────────┤
│  Similar Items  │
└─────────────────┘
[Sticky Add to Cart]
```

---

## 🎯 Key Features Implemented

### ✅ Large Gallery with Thumbnails
- Main image with zoom on hover
- Thumbnail navigation
- Smooth transitions

### ✅ Smooth Zoom
- Mouse position-based zoom
- 1.5x scale on hover
- Zoom indicator icon

### ✅ Swipe Gallery (Mobile)
- Touch-friendly navigation
- Arrow buttons
- Thumbnail selection

### ✅ Title + Brand + Reviews
- Category label
- Product name
- Star ratings with count

### ✅ Price Block with Discount
- Current price (bold)
- Original price (strikethrough)
- Discount badge (green)

### ✅ Offers Section (AJIO-style)
- Multiple offer cards
- Icons for visual hierarchy
- Hover effects

### ✅ Size Selector
- Available sizes highlighted
- Unavailable sizes grayed out
- Size guide link

### ✅ Sticky Add to Cart (Mobile)
- Appears on scroll
- Product name + price
- Quick add button

### ✅ Delivery Pincode Checker
- 6-digit validation
- Delivery availability check
- Estimated days display

### ✅ Similar Items Carousel
- Horizontal scroll
- Arrow navigation
- Hover effects

### ✅ Wishlist Heart Animation
- Pop animation on click
- Fill/unfill transition
- Optimistic UI update

---

## 🎨 Design Tokens

### Border Radius
```css
none:   0px      /* Sharp edges (default) */
sm:     2px      /* Subtle rounding */
md:     4px      /* Standard rounding */
lg:     8px      /* Pronounced rounding */
full:   9999px   /* Circular */
```

### Shadows
```css
sm:   0 1px 2px rgba(0,0,0,0.05)
md:   0 4px 6px rgba(0,0,0,0.1)
lg:   0 10px 15px rgba(0,0,0,0.1)
xl:   0 20px 25px rgba(0,0,0,0.1)
```

### Transitions
```css
fast:     150ms
normal:   300ms
slow:     500ms

easing:   cubic-bezier(0.4, 0, 0.2, 1)
```

---

## ♿ Accessibility Guidelines

### Color Contrast
- Text on white: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear focus states

### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators
- Logical tab order

### Screen Readers
- Semantic HTML elements
- ARIA labels on icons
- Alt text for images

### Touch Targets
- Minimum 44x44px for mobile
- Adequate spacing between elements

---

## 📦 Component Library

### Available Components
```
components/pdp/
├── product-image-gallery.tsx    # Image gallery with zoom
├── size-selector.tsx             # Size selection
├── pincode-checker.tsx           # Delivery checker
├── wishlist-button.tsx           # Wishlist toggle
├── offers-section.tsx            # Offers display
├── sticky-add-to-cart.tsx        # Mobile sticky CTA
└── similar-products-carousel.tsx # Related products
```

---

## 🚀 Usage Examples

### Product Detail Page
```tsx
import { ProductImageGallery } from "@/components/pdp/product-image-gallery"
import { SizeSelector } from "@/components/pdp/size-selector"
import { WishlistButton } from "@/components/pdp/wishlist-button"

export default function ProductPage() {
  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <ProductImageGallery images={images} productName={name} />
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-3xl font-bold">₹{price}</p>
        
        <SizeSelector sizes={sizes} onSizeSelect={handleSize} />
        
        <div className="flex gap-3">
          <Button className="flex-1">Add to Bag</Button>
          <WishlistButton productId={id} />
        </div>
      </div>
    </div>
  )
}
```

---

## 🎯 Best Practices

### DO ✅
- Use generous whitespace
- Prioritize product imagery
- Keep interactions subtle
- Maintain consistent spacing
- Use system fonts
- Optimize images
- Test on mobile devices

### DON'T ❌
- Overcrowd the interface
- Use too many colors
- Add unnecessary animations
- Ignore mobile experience
- Forget accessibility
- Use low-quality images

---

## 📊 Performance Guidelines

### Image Optimization
- Use Next.js Image component
- Lazy load below-the-fold images
- Provide appropriate sizes
- Use WebP format when possible

### Animation Performance
- Use CSS transforms (not position)
- Prefer opacity over visibility
- Use will-change sparingly
- Test on low-end devices

---

**Design System Version: 1.0**  
**Last Updated: 2024**  
**Maintained by: Thrift_ind Team**
