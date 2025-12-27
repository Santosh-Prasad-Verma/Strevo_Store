# 📱 Social & Community Features

## ✅ 6 Features Implemented

### 1. 📸 User-Generated Content
- Customer photo gallery
- Upload & share outfits
- Like & comment system
- Instagram handle tagging
- Featured content section
- Admin approval system

### 2. 🔐 Social Login
- Google OAuth integration
- Facebook login
- Track social connections
- Seamless signup/signin

### 3. 📤 Social Sharing
- Share to WhatsApp, Facebook, Twitter
- Copy link functionality
- Track sharing analytics
- Product-specific sharing

### 4. 💼 Influencer Dashboard
- Unique influencer codes
- Commission tracking
- Sales analytics
- Payout management
- Performance metrics

### 5. 💬 Live Chat Support
- Real-time messaging
- Customer support widget
- Chat history
- Agent assignment
- Bot responses

### 6. 🗣️ Community Forum
- Discussion categories
- Create posts & replies
- Like system
- Pin important posts
- Search functionality

---

## 🗄️ Database Setup

Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
-- Copy entire content from:
-- supabase/migrations/create_social_community_features.sql
```

---

## 📖 Usage Guide

### 1. User-Generated Content Gallery

**Display on homepage:**
```tsx
import { UserGallery } from "@/components/user-gallery"

<UserGallery />
```

**Features:**
- Upload photos with captions
- Tag Instagram handles
- Like photos
- Admin approval before showing

**Admin approval:**
```sql
UPDATE user_content 
SET is_approved = true, is_featured = true 
WHERE id = 123;
```

---

### 2. Social Login

**Setup Google OAuth:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add to Supabase: **Authentication → Providers → Google**
4. Enable Google provider

**Setup Facebook Login:**

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create app and get App ID/Secret
3. Add to Supabase: **Authentication → Providers → Facebook**
4. Enable Facebook provider

**In your login page:**
```tsx
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

// Google login
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})

// Facebook login
await supabase.auth.signInWithOAuth({
  provider: 'facebook',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

---

### 3. Social Sharing

**Add to product page:**
```tsx
import { SocialShare } from "@/components/social-share"

<SocialShare 
  productId={product.id}
  productName={product.name}
  productImage={product.image}
/>
```

**Track most shared products:**
```sql
SELECT 
  product_id,
  platform,
  COUNT(*) as share_count
FROM social_shares
GROUP BY product_id, platform
ORDER BY share_count DESC
LIMIT 10;
```

---

### 4. Influencer Dashboard

**Display dashboard:**
```tsx
import { InfluencerDashboard } from "@/components/influencer-dashboard"

<InfluencerDashboard userId={user.id} />
```

**Create influencer account:**
```sql
INSERT INTO influencers (user_id, influencer_code, commission_rate)
VALUES (
  'user-uuid',
  generate_influencer_code('user-uuid'),
  10.00 -- 10% commission
);
```

**Track sale with influencer code:**
```tsx
// At checkout
if (influencerCode) {
  const influencer = await getInfluencerByCode(influencerCode)
  const commission = orderTotal * (influencer.commission_rate / 100)
  
  await recordInfluencerSale({
    influencerId: influencer.id,
    orderId: order.id,
    saleAmount: orderTotal,
    commissionAmount: commission
  })
}
```

**Process payouts:**
```sql
-- Get influencers ready for payout
SELECT * FROM influencers 
WHERE total_commission >= payout_threshold 
AND is_active = true;

-- Create payout
INSERT INTO influencer_payouts (influencer_id, amount, payment_method)
VALUES (123, 5000, 'bank_transfer');
```

---

### 5. Live Chat Support

**Add to all pages:**
```tsx
import { LiveChatWidget } from "@/components/live-chat-widget"

// In your layout or main component
<LiveChatWidget />
```

**Features:**
- Floating chat button
- Real-time messaging
- Chat history
- Bot auto-responses
- Agent assignment (coming soon)

**View active chats (Admin):**
```sql
SELECT 
  cs.*,
  COUNT(cm.id) as message_count
FROM chat_sessions cs
LEFT JOIN chat_messages cm ON cs.id = cm.session_id
WHERE cs.status = 'active'
GROUP BY cs.id
ORDER BY cs.started_at DESC;
```

---

### 6. Community Forum

**Create forum page:**
```tsx
// app/community/page.tsx
import { ForumCategories } from "@/components/forum-categories"

export default function CommunityPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Community Forum</h1>
      <ForumCategories />
    </div>
  )
}
```

**Forum structure:**
- Categories (Style Tips, Reviews, etc.)
- Posts with title & content
- Replies & nested discussions
- Like system
- Pin important posts

**Create post:**
```sql
INSERT INTO forum_posts (category_id, user_id, title, content, slug)
VALUES (
  1,
  'user-uuid',
  'Best Oversized Tees?',
  'Looking for recommendations...',
  'best-oversized-tees'
);
```

---

## 🎯 Integration Examples

### Homepage - Complete Social Features
```tsx
import { UserGallery } from "@/components/user-gallery"
import { LiveChatWidget } from "@/components/live-chat-widget"

export default function HomePage() {
  return (
    <>
      {/* Your homepage content */}
      <UserGallery />
      <LiveChatWidget />
    </>
  )
}
```

### Product Page - Social Sharing
```tsx
import { SocialShare } from "@/components/social-share"

<div className="flex gap-2">
  <AddToCartButton />
  <SocialShare 
    productId={product.id}
    productName={product.name}
  />
</div>
```

### Profile Page - Influencer Dashboard
```tsx
import { InfluencerDashboard } from "@/components/influencer-dashboard"

{user.is_influencer && (
  <InfluencerDashboard userId={user.id} />
)}
```

---

## 📊 Analytics Queries

### Top User Content
```sql
SELECT 
  uc.*,
  u.email as user_email
FROM user_content uc
JOIN auth.users u ON uc.user_id = u.id
WHERE uc.is_approved = true
ORDER BY uc.likes_count DESC
LIMIT 20;
```

### Influencer Leaderboard
```sql
SELECT 
  i.influencer_code,
  i.total_sales,
  i.total_commission,
  COUNT(is.id) as total_orders
FROM influencers i
LEFT JOIN influencer_sales is ON i.id = is.influencer_id
GROUP BY i.id
ORDER BY i.total_commission DESC
LIMIT 10;
```

### Most Shared Products
```sql
SELECT 
  p.name,
  COUNT(ss.id) as total_shares,
  COUNT(DISTINCT ss.platform) as platforms_used
FROM social_shares ss
JOIN products p ON ss.product_id = p.id
GROUP BY p.id
ORDER BY total_shares DESC
LIMIT 10;
```

### Forum Activity
```sql
SELECT 
  fc.name as category,
  COUNT(fp.id) as posts,
  SUM(fp.replies_count) as replies,
  SUM(fp.views_count) as views
FROM forum_categories fc
LEFT JOIN forum_posts fp ON fc.id = fp.category_id
GROUP BY fc.id
ORDER BY posts DESC;
```

---

## 🎨 Customization

### Influencer Commission Rates
```sql
-- Update commission rate
UPDATE influencers 
SET commission_rate = 15.00 
WHERE user_id = 'user-uuid';

-- Set payout threshold
UPDATE influencers 
SET payout_threshold = 2000 
WHERE user_id = 'user-uuid';
```

### Forum Categories
```sql
-- Add new category
INSERT INTO forum_categories (name, description, slug, icon)
VALUES ('Sneaker Talk', 'Discuss sneakers and footwear', 'sneakers', '👟');
```

### Chat Auto-Responses
```tsx
// In live-chat-widget.tsx
const autoResponses = {
  'shipping': 'We offer free shipping on orders above ₹999!',
  'return': 'You can return items within 30 days of delivery.',
  'size': 'Check our size guide for accurate measurements.'
}
```

---

## 🚀 Advanced Features

### Social Login Benefits
- Faster signup (1-click)
- Auto-fill profile data
- Trusted authentication
- Reduced cart abandonment

### Influencer Program Benefits
- Word-of-mouth marketing
- Authentic promotion
- Performance-based cost
- Scalable growth

### Live Chat Benefits
- Instant support
- Higher conversion rates
- Reduced support tickets
- Better customer satisfaction

### Community Forum Benefits
- User engagement
- SEO content
- Customer insights
- Brand loyalty

---

## 💡 Best Practices

### User-Generated Content
- Moderate before publishing
- Feature best content on homepage
- Run monthly contests
- Reward top contributors

### Influencer Program
- Vet influencers before approval
- Set clear guidelines
- Pay on time
- Provide marketing materials

### Live Chat
- Respond within 2 minutes
- Use canned responses
- Escalate complex issues
- Track satisfaction scores

### Community Forum
- Moderate regularly
- Pin helpful posts
- Reward active members
- Create weekly topics

---

## ✨ All Features Ready!

Your e-commerce site now has:
✅ User-generated content gallery
✅ Social login (Google, Facebook)
✅ Social sharing buttons
✅ Influencer dashboard & tracking
✅ Live chat support widget
✅ Community forum

Run the database migration and start building your community! 🚀
