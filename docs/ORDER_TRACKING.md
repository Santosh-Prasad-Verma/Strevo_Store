# Order Tracking System

## Overview
Live order status tracking system that shows customers real-time updates on their order progress from placement to delivery.

## Features

### Customer View (`/orders/[id]`)
- **Visual Timeline**: Shows 3 stages with icons and timestamps
  - Order Placed (Clock icon) - Shows order creation date/time
  - Shipped (Truck icon) - Shows shipping date/time + tracking number + carrier
  - Delivered (CheckCircle icon) - Shows delivery confirmation
- **Status Badge**: Color-coded status indicator
- **Tracking Number**: Displays when order is shipped
- **Carrier Information**: Shows shipping carrier name

### Admin Panel (`/admin/orders/[id]`)
- **Status Update Dropdown**: Change order status (pending, processing, shipped, delivered, cancelled, refunded)
- **Tracking Form**: Add/update tracking number and carrier
- **Auto-timestamps**: Automatically sets `shipped_at` when status changes to "shipped"

## Database Schema

### Orders Table Columns
```sql
tracking_number text       -- Tracking number from carrier
carrier text              -- Carrier name (Delhivery, Blue Dart, etc.)
shipped_at timestamptz    -- Auto-set when status = 'shipped'
delivered_at timestamptz  -- Auto-set when status = 'delivered'
```

### Setup
Run migration script:
```bash
psql -d your_database -f scripts/016_add_order_tracking.sql
```

## Workflow

1. **Order Placed**: Customer completes checkout
   - Status: `processing`
   - Timeline shows "Order Placed" with timestamp

2. **Admin Ships Order**: Admin updates status to "shipped" and adds tracking
   - Status: `shipped`
   - `shipped_at` timestamp auto-set
   - Timeline shows "Shipped" with tracking number and carrier

3. **Order Delivered**: Admin marks as delivered
   - Status: `delivered`
   - `delivered_at` timestamp auto-set
   - Timeline shows "Delivered" with green checkmark

## Supported Carriers
- Delhivery
- Blue Dart
- DTDC
- FedEx
- DHL
- India Post

## API Endpoints

### Update Order Status
```
PATCH /api/admin/orders/[id]/status
Body: { "status": "shipped" }
```

### Update Tracking Info
```
PATCH /api/admin/orders/[id]/tracking
Body: { "tracking_number": "ABC123", "carrier": "Delhivery" }
```

## Status Colors
- **Processing**: Yellow badge
- **Shipped**: Blue badge
- **Delivered**: Green badge
- **Cancelled**: Red badge

## Customer Experience
Customers can view their order status at any time by:
1. Going to "My Orders" from profile menu
2. Clicking on specific order
3. Viewing the visual timeline showing current status
4. Seeing tracking number once order is shipped
