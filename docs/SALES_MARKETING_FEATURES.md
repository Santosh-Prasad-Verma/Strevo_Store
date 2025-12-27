# 💰 Sales & Marketing Features

## ✅ 8 Features Implemented

### 1. ⚡ Flash Sales / Daily Deals
- Time-limited offers with countdown
- Percentage discounts
- Product/category specific
- Usage limits
- Auto-expiry

### 2. 🎁 Bundle Deals
- "Buy 2 Get 1 Free"
- Percentage off bundles
- Fixed price bundles
- Multiple product combinations

### 3. 📧 Abandoned Cart Recovery
- Track abandoned carts
- Auto email reminders
- Recovery tracking
- Session-based tracking

### 4. 💎 Dynamic Pricing
- Member tier discounts
- Bulk pricing
- Time-based pricing
- Category/product specific

### 5. 🎫 Gift Cards
- Digital gift card system
- Custom amounts
- Personal messages
- Email delivery
- Balance tracking

### 6. 🏷️ Promo Code System
- Percentage/fixed discounts
- Free shipping codes
- Usage limits
- User limits
- Min purchase requirements
- Product/category specific

### 7. 📦 Pre-Order System
- Sell before stock arrives
- Deposit payments
- Expected delivery dates
- Status tracking

### 8. 🔔 Back-in-Stock Alerts
- Email notifications
- Size/color specific
- Auto-notify when restocked

---

## 🗄️ Database Setup

Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
-- Copy entire content from:
-- supabase/migrations/create_sales_marketing_features.sql
```

---

## 📖 Usage Guide

### 1. Flash Sales

**Display banner:**
```tsx
import { FlashSaleBanner } from "@/components/flash-sale-banner"

<FlashSaleBanner />
```

**Create flash sale (Admin):**
```sql
INSERT INTO flash_sales (name, description, discount_percentage, start_time, end_time, product_ids)
VALUES (
  'Weekend Flash Sale',
  '50% off selected items',
  50,
  '2024-01-20 00:00:00',
  '2024-01-21 23:59:59',
  ARRAY['product-uuid-1', 'product-uuid-2']::UUID[]
);
```

**Check if product is on flash sale:**
```tsx
const flashSale = await getActiveFlashSale(productId)
if (flashSale) {
  discountedPrice = price * (1 - flashSale.discount_percentage / 100)
}
```

---

### 2. Bundle Deals

**Create bundle:**
```sql
-- Buy 2 Get 1 Free
INSERT INTO bundle_deals (name, product_ids, bundle_type, buy_quantity, get_quantity, is_active)
VALUES (
  'Buy 2 Get 1 Free - T-Shirts',
  ARRAY['uuid1', 'uuid2', 'uuid3']::UUID[],
  'buy_x_get_y',
  2,
  1,
  true
);

-- 30% off bundle
INSERT INTO bundle_deals (name, product_ids, bundle_type, discount_percentage, is_active)
VALUES (
  'Complete Outfit Bundle',
  ARRAY['uuid1', 'uuid2']::UUID[],
  'percentage_off',
  30,
  true
);
```

---

### 3. Abandoned Cart Recovery

**Track cart:**
```tsx
// Auto-save cart every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    if (cart.length > 0) {
      fetch("/api/cart/save", {
        method: "POST",
        body: JSON.stringify({ cart, email: user?.email })
      })
    }
  }, 30000)
  return () => clearInterval(interval)
}, [cart])
```

**Send recovery emails (Cron job):**
```tsx
// Run daily
const abandonedCarts = await getAbandonedCarts()
for (const cart of abandonedCarts) {
  await sendRecoveryEmail(cart.email, cart.cart_data)
}
```

---

### 4. Dynamic Pricing

**Create pricing rule:**
```sql
-- Member discount
INSERT INTO pricing_rules (name, rule_type, member_tier, discount_percentage, is_active)
VALUES ('Gold Member Discount', 'member_discount', 'gold', 15, true);

-- Bulk pricing
INSERT INTO pricing_rules (name, rule_type, min_quantity, discount_percentage, is_active)
VALUES ('Buy 5+ Save 20%', 'bulk_pricing', 5, 20, true);

-- Happy hour
INSERT INTO pricing_rules (name, rule_type, start_time, end_time, discount_percentage, is_active)
VALUES ('Happy Hour', 'time_based', '14:00', '16:00', 10, true);
```

**Apply pricing:**
```tsx
const price = await getDynamicPrice(productId, userId, quantity)
```

---

### 5. Gift Cards

**Purchase form:**
```tsx
import { GiftCardPurchase } from "@/components/gift-card-purchase"

<GiftCardPurchase />
```

**Redeem at checkout:**
```tsx
import { GiftCardInput } from "@/components/gift-card-input"

<GiftCardInput onApply={(balance) => setDiscount(balance)} />
```

**Check balance:**
```tsx
const balance = await checkGiftCardBalance("GC123456789")
```

---

### 6. Promo Codes

**Apply at checkout:**
```tsx
import { PromoCodeInput } from "@/components/promo-code-input"

<PromoCodeInput 
  cartTotal={total}
  onApply={(discount, code) => {
    setDiscount(discount)
    setAppliedCode(code)
  }}
/>
```

**Create promo code (Admin):**
```sql
-- 20% off
INSERT INTO promo_codes (code, discount_type, discount_value, usage_limit, end_date, is_active)
VALUES ('SAVE20', 'percentage', 20, 100, '2024-12-31', true);

-- ₹500 off
INSERT INTO promo_codes (code, discount_type, discount_value, min_purchase_amount, is_active)
VALUES ('FLAT500', 'fixed_amount', 500, 2000, true);

-- Free shipping
INSERT INTO promo_codes (code, discount_type, discount_value, is_active)
VALUES ('FREESHIP', 'free_shipping', 0, true);
```

---

### 7. Pre-Orders

**Enable pre-order:**
```tsx
{product.stock === 0 && product.pre_order_enabled && (
  <Button onClick={() => createPreOrder(product.id)}>
    Pre-Order Now - Ships {product.expected_date}
  </Button>
)}
```

**Create pre-order:**
```tsx
await createPreOrder({
  productId,
  quantity,
  totalAmount,
  depositAmount: totalAmount * 0.3, // 30% deposit
  expectedDeliveryDate: '2024-03-01'
})
```

---

### 8. Back-in-Stock Alerts

**Subscribe button:**
```tsx
import { StockAlertButton } from "@/components/stock-alert-button"

{product.stock === 0 && (
  <StockAlertButton 
    productId={product.id}
    productName={product.name}
  />
)}
```

**Notify subscribers (when restocked):**
```tsx
await notifyStockAlerts(productId)
```

---

## 🎯 Admin Dashboard Features

### Flash Sales Management
```tsx
// app/admin/flash-sales/page.tsx
- Create/edit flash sales
- View active sales
- Track usage
- End sale early
```

### Promo Code Management
```tsx
// app/admin/promo-codes/page.tsx
- Create codes
- Set limits
- Track usage
- Deactivate codes
```

### Gift Card Management
```tsx
// app/admin/gift-cards/page.tsx
- View all cards
- Check balances
- Issue refunds
- Track transactions
```

---

## 📊 Analytics Queries

### Flash Sale Performance
```sql
SELECT 
  name,
  discount_percentage,
  used_count,
  (used_count::FLOAT / NULLIF(max_uses, 0) * 100) as usage_percentage
FROM flash_sales
WHERE end_time > NOW()
ORDER BY used_count DESC;
```

### Top Promo Codes
```sql
SELECT 
  pc.code,
  pc.discount_type,
  pc.usage_count,
  SUM(pcu.discount_amount) as total_discount_given
FROM promo_codes pc
LEFT JOIN promo_code_usage pcu ON pc.id = pcu.promo_code_id
GROUP BY pc.id
ORDER BY pc.usage_count DESC
LIMIT 10;
```

### Abandoned Cart Recovery Rate
```sql
SELECT 
  COUNT(*) as total_abandoned,
  SUM(CASE WHEN recovered THEN 1 ELSE 0 END) as recovered,
  (SUM(CASE WHEN recovered THEN 1 ELSE 0 END)::FLOAT / COUNT(*) * 100) as recovery_rate
FROM abandoned_carts
WHERE created_at > NOW() - INTERVAL '30 days';
```

### Gift Card Revenue
```sql
SELECT 
  COUNT(*) as cards_sold,
  SUM(initial_amount) as total_revenue,
  SUM(current_balance) as outstanding_balance
FROM gift_cards
WHERE created_at > NOW() - INTERVAL '30 days';
```

---

## 🚀 Integration Examples

### Checkout Page - Complete
```tsx
import { PromoCodeInput } from "@/components/promo-code-input"
import { GiftCardInput } from "@/components/gift-card-input"

export default function CheckoutPage() {
  const [discount, setDiscount] = useState(0)
  const [giftCardDiscount, setGiftCardDiscount] = useState(0)
  
  const finalTotal = cartTotal - discount - giftCardDiscount

  return (
    <div>
      <h2>Order Summary</h2>
      <p>Subtotal: ₹{cartTotal}</p>
      
      <PromoCodeInput 
        cartTotal={cartTotal}
        onApply={(amount) => setDiscount(amount)}
      />
      
      <GiftCardInput 
        onApply={(amount) => setGiftCardDiscount(amount)}
      />
      
      <p>Discount: -₹{discount + giftCardDiscount}</p>
      <p className="font-bold">Total: ₹{finalTotal}</p>
    </div>
  )
}
```

### Homepage - Flash Sale Banner
```tsx
import { FlashSaleBanner } from "@/components/flash-sale-banner"

export default function HomePage() {
  return (
    <>
      <FlashSaleBanner />
      {/* Rest of homepage */}
    </>
  )
}
```

---

## 💡 Best Practices

### Flash Sales
- Create urgency with countdown timers
- Limit quantities to increase FOMO
- Promote 24-48 hours in advance
- Send email notifications

### Promo Codes
- Use memorable codes (SAVE20, WELCOME10)
- Set expiry dates
- Limit usage to prevent abuse
- Track ROI per code

### Abandoned Carts
- Send first email after 1 hour
- Send second email after 24 hours
- Offer small discount (5-10%) in second email
- Include product images

### Gift Cards
- Offer bonus amounts (Buy ₹1000, Get ₹1100)
- Promote during holidays
- Allow custom messages
- Send beautiful email designs

---

## ✨ All Features Ready!

Your e-commerce site now has:
✅ Flash sales with countdown
✅ Bundle deals (BOGO, etc.)
✅ Abandoned cart recovery
✅ Dynamic pricing rules
✅ Digital gift cards
✅ Promo code system
✅ Pre-order system
✅ Stock alert notifications

Run the database migration and start using these powerful sales tools! 🚀
