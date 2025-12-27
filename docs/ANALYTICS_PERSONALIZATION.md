# 📊 Analytics & Personalization Features

## ✅ 6 Features Implemented

### 1. 🎯 Personalized Homepage
- Based on browsing history
- Category-based recommendations
- User-specific product suggestions
- Real-time personalization

### 2. 📧 Email Marketing
- Newsletter campaigns
- Subscriber management
- Campaign creation
- Email templates

### 3. 🔔 Push Notifications
- Browser notifications
- Permission prompts
- Subscription management
- Real-time alerts

### 4. 🧪 A/B Testing
- Test different designs
- Variant tracking
- Conversion tracking
- Performance comparison

### 5. 🔥 Heatmap Analytics
- Click tracking
- User behavior analysis
- Page interaction data
- Visual heatmaps

### 6. 🤖 AI Recommendations
- Smart product suggestions
- Category-based matching
- Price range filtering
- Personalized results

---

## 📖 Usage Guide

### Personalized Homepage

**Add to homepage:**
```tsx
import { PersonalizedHomepage } from "@/components/personalized-homepage"

export default function HomePage() {
  const { user } = await getUser()
  
  return (
    <>
      <PersonalizedHomepage userId={user?.id} />
    </>
  )
}
```

**Track product views:**
```tsx
import { trackEvent } from "@/lib/actions/analytics"

// On product page
useEffect(() => {
  trackEvent("product_view", {
    productId: product.id,
    category: product.category,
    price: product.price
  }, window.location.pathname)
}, [product])
```

---

### Newsletter Signup

**Add to footer:**
```tsx
import { NewsletterSignup } from "@/components/newsletter-signup"

<NewsletterSignup />
```

**Features:**
- Email validation
- Success message
- Duplicate prevention
- Auto-subscribe

---

### Push Notifications

**Add to layout:**
```tsx
import { PushNotificationPrompt } from "@/components/push-notification-prompt"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <PushNotificationPrompt />
      </body>
    </html>
  )
}
```

**Send notification (server-side):**
```tsx
import webpush from "web-push"

const payload = JSON.stringify({
  title: "New Arrival!",
  body: "Check out our latest collection",
  icon: "/icon.png"
})

await webpush.sendNotification(subscription, payload)
```

---

### A/B Testing

**Test different components:**
```tsx
import { ABTestWrapper } from "@/components/ab-test-wrapper"

<ABTestWrapper
  testId="homepage-hero"
  variantA={<HeroV1 />}
  variantB={<HeroV2 />}
/>
```

**Track conversions:**
```tsx
const trackConversion = async (testId: string) => {
  await fetch("/api/ab-test/convert", {
    method: "POST",
    body: JSON.stringify({ testId })
  })
}
```

---

### Heatmap Analytics

**Add to layout:**
```tsx
import { HeatmapTracker } from "@/components/heatmap-tracker"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <HeatmapTracker />
      </body>
    </html>
  )
}
```

**View heatmap:**
- Admin panel: `/admin/heatmap`
- See click patterns
- Analyze user behavior

---

### AI Recommendations

**On product page:**
```tsx
import { AIRecommendations } from "@/components/ai-recommendations"

<AIRecommendations productId={product.id} />
```

**On homepage:**
```tsx
<AIRecommendations />
```

**Algorithm:**
- Same category matching
- Price range similarity (±30%)
- Excludes current product
- Limits to 8 products

---

## 🎯 Admin Features

### Analytics Dashboard
**URL:** `/admin/analytics`

**Metrics:**
- Total users
- Page views
- Conversions
- Newsletter subscribers

### Email Campaigns
**URL:** `/admin/email-campaigns`

**Features:**
- Create campaigns
- Set subject & content
- Draft/send status
- Track performance

### Heatmap Viewer
**URL:** `/admin/heatmap`

**Features:**
- View all clicks
- Page-specific data
- Position tracking
- Element identification

---

## 🗄️ Database Schema

### user_activity
```sql
- id (UUID)
- user_id (UUID)
- session_id (TEXT)
- event_type (TEXT)
- event_data (JSONB)
- page_url (TEXT)
- created_at (TIMESTAMPTZ)
```

### email_campaigns
```sql
- id (UUID)
- name (TEXT)
- subject (TEXT)
- content (TEXT)
- segment (TEXT)
- status (TEXT)
- sent_count (INTEGER)
- open_rate (DECIMAL)
- click_rate (DECIMAL)
- created_at (TIMESTAMPTZ)
```

### newsletter_subscribers
```sql
- id (UUID)
- email (TEXT UNIQUE)
- subscribed (BOOLEAN)
- created_at (TIMESTAMPTZ)
```

### push_subscriptions
```sql
- id (UUID)
- user_id (UUID)
- endpoint (TEXT)
- keys (JSONB)
- created_at (TIMESTAMPTZ)
```

### ab_tests
```sql
- id (UUID)
- name (TEXT)
- variant_a (JSONB)
- variant_b (JSONB)
- status (TEXT)
- created_at (TIMESTAMPTZ)
```

### ab_test_results
```sql
- id (UUID)
- test_id (UUID)
- user_id (UUID)
- variant (TEXT)
- converted (BOOLEAN)
- created_at (TIMESTAMPTZ)
```

### heatmap_clicks
```sql
- id (UUID)
- page_url (TEXT)
- x_position (INTEGER)
- y_position (INTEGER)
- element (TEXT)
- created_at (TIMESTAMPTZ)
```

---

## 📊 Analytics Events

### Track Events
```tsx
import { trackEvent } from "@/lib/actions/analytics"

// Product view
trackEvent("product_view", { productId, category, price })

// Add to cart
trackEvent("add_to_cart", { productId, quantity })

// Purchase
trackEvent("purchase", { orderId, total, items })

// Search
trackEvent("search", { query, results })
```

---

## 🚀 Performance Tips

### Personalization
- Cache user preferences
- Batch history queries
- Limit recommendation count
- Use CDN for images

### Email Marketing
- Queue email sending
- Use email service (SendGrid, Mailgun)
- Track opens/clicks
- Segment subscribers

### Push Notifications
- Request permission strategically
- Don't spam users
- Personalize messages
- Track engagement

### A/B Testing
- Run tests for 2+ weeks
- Ensure statistical significance
- Test one variable at a time
- Document results

### Heatmap
- Sample clicks (not 100%)
- Aggregate data daily
- Archive old data
- Use visualization tools

---

## 🔒 Privacy & Compliance

### GDPR Compliance
- Cookie consent
- Data export
- Right to deletion
- Privacy policy

### Data Collection
- Anonymous tracking option
- Opt-out mechanism
- Clear disclosure
- Secure storage

---

## ✨ All Features Ready!

Your e-commerce platform now has:
✅ Personalized homepage
✅ Email marketing campaigns
✅ Push notifications
✅ A/B testing framework
✅ Heatmap analytics
✅ AI-powered recommendations

These features will boost engagement and conversions! 🚀
