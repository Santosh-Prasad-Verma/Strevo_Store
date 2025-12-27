# 📦 Admin Product Upload Guide

## 🗑️ Clear Existing Products

Run this SQL in Supabase SQL Editor:

```sql
-- Delete specific products
DELETE FROM products WHERE id IN (
  '07146c3d-d70b-470a-a493-fba50045b608',
  'f2efd9cb-4191-4431-a459-9c0dd8c4d77f',
  'dd5195ed-6c68-4068-8798-8125a72e0a78',
  '68aca678-5de1-4180-95fb-e2b668d712e7',
  'ea31b9f9-458f-4653-a0ec-755fc48e8a81'
);

-- OR clear all products to start fresh
DELETE FROM products;
```

---

## 📤 Upload Products via Admin Panel

### Step 1: Access Admin Panel
```
http://localhost:3000/admin/products
```

### Step 2: Add New Product

Click "Add Product" button and fill in:

**Required Fields:**
- Product Name
- Description
- Price (₹)
- Category
- Stock Quantity

**Optional Fields:**
- Sale Price
- SKU
- Sizes (XS, S, M, L, XL, XXL)
- Colors
- Tags (comma-separated)

**Images:**
- Upload product images
- First image = main image
- Multiple images supported
- Recommended: 1000x1000px, JPG/PNG

### Step 3: Product Details

**Category Options:**
- T-Shirts
- Shirts
- Pants
- Jackets
- Hoodies
- Accessories

**Tags (for better search):**
- Style: streetwear, casual, formal, oversized
- Season: summer, winter, all-season
- Gender: men, women, unisex
- Features: cotton, premium, limited-edition

**Example Tags:**
```
streetwear, oversized, cotton, black, trending
```

### Step 4: Save & Publish

- Click "Save Product"
- Product appears on homepage
- Searchable via Meilisearch
- Cached for fast loading

---

## 🖼️ Image Upload Best Practices

### Image Requirements:
- Format: JPG, PNG, WebP
- Size: Max 5MB per image
- Dimensions: 1000x1000px (square)
- Background: White or transparent

### Multiple Images:
1. Main product image (front view)
2. Back view
3. Side view
4. Detail shots
5. Lifestyle/model shots

### Image Naming:
```
product-name-front.jpg
product-name-back.jpg
product-name-detail.jpg
```

---

## 📊 Product Data Structure

```typescript
{
  name: "Oversized Black Tee",
  description: "Premium cotton oversized t-shirt",
  price: 1299,
  sale_price: 999,
  category: "T-Shirts",
  stock: 50,
  sku: "BLK-TEE-001",
  sizes: ["S", "M", "L", "XL"],
  colors: ["Black", "White"],
  tags: ["streetwear", "oversized", "cotton"],
  images: [
    "/uploads/black-tee-front.jpg",
    "/uploads/black-tee-back.jpg"
  ],
  is_featured: true,
  is_new: true
}
```

---

## 🔄 Bulk Upload (CSV)

### CSV Format:
```csv
name,description,price,category,stock,tags
"Black Tee","Premium cotton tee",1299,"T-Shirts",50,"streetwear,cotton"
"Cargo Pants","Wide leg cargo pants",2499,"Pants",30,"streetwear,cargo"
```

### Import via Admin:
1. Go to `/admin/products/import`
2. Upload CSV file
3. Map columns
4. Review & import

---

## 🏷️ Product Badges

Products automatically get badges:

**NEW Badge:**
- Products created in last 30 days
- Set `is_new: true`

**SALE Badge:**
- When `sale_price < price`
- Automatically applied

**TRENDING Badge:**
- High view count
- Set `is_trending: true`

**BESTSELLER Badge:**
- High sales count
- Set `is_bestseller: true`

---

## 🔍 Search Optimization

Products are automatically indexed in Meilisearch with:
- Product name
- Description
- Category
- Tags
- Colors
- Sizes

**Searchable Fields:**
```javascript
{
  searchableAttributes: [
    'name',
    'description',
    'category',
    'tags',
    'colors'
  ],
  filterableAttributes: [
    'category',
    'price',
    'sizes',
    'colors',
    'is_featured'
  ]
}
```

---

## 💾 Storage Setup

### Supabase Storage Bucket:
```sql
-- Create products bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Set policies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
```

---

## 🚀 Quick Start Checklist

- [ ] Clear existing products (run SQL)
- [ ] Prepare product images (1000x1000px)
- [ ] Access admin panel
- [ ] Upload first product
- [ ] Add tags & categories
- [ ] Upload images
- [ ] Save & publish
- [ ] Verify on homepage
- [ ] Test search functionality

---

## 📝 Example Product Entry

**Product:** Oversized Black Streetwear Tee

```
Name: Oversized Black Tee
Description: Premium 100% cotton oversized t-shirt with dropped shoulders. Perfect for streetwear style.
Price: ₹1,299
Sale Price: ₹999
Category: T-Shirts
Stock: 50
SKU: OST-BLK-001
Sizes: S, M, L, XL, XXL
Colors: Black, White, Grey
Tags: streetwear, oversized, cotton, premium, trending
Images: 
  - black-tee-front.jpg
  - black-tee-back.jpg
  - black-tee-detail.jpg
Featured: Yes
New: Yes
```

---

## 🎯 Admin Panel Features

### Product Management:
- ✅ Add/Edit/Delete products
- ✅ Bulk actions
- ✅ Image upload
- ✅ Stock management
- ✅ Category management
- ✅ Tag management

### Inventory:
- ✅ Stock tracking
- ✅ Low stock alerts
- ✅ Out of stock handling
- ✅ Restock notifications

### Analytics:
- ✅ Product views
- ✅ Sales data
- ✅ Popular products
- ✅ Search queries

---

## 🔧 Troubleshooting

**Images not uploading?**
- Check file size (<5MB)
- Verify Supabase storage bucket exists
- Check storage policies

**Product not appearing?**
- Clear Redis cache
- Reindex Meilisearch
- Check product status (published)

**Search not working?**
- Run Meilisearch sync: `npm run meili:sync`
- Check Meilisearch connection
- Verify index settings

---

## ✨ You're Ready!

Start with zero products and build your catalog through the admin panel. All features (search, filters, recommendations) will work automatically as you add products.

Admin Panel: `http://localhost:3000/admin/products`
