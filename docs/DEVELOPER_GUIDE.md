# Developer Guide - Profile Module

## 🎯 Quick Reference

### Run Locally
```bash
npm install
npm run dev
# Visit http://localhost:3000/profile
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
npm start
```

---

## 📝 Common Tasks

### 1. Add a New Field to Profile

**Step 1: Update Database**
```sql
-- In Supabase SQL Editor
ALTER TABLE profiles ADD COLUMN bio TEXT;
```

**Step 2: Update TypeScript Type**
```typescript
// lib/types/database.ts
export interface Profile {
  // ... existing fields
  bio: string | null
}
```

**Step 3: Update Form**
```tsx
// components/profile/edit-profile-dialog.tsx
<div>
  <Label htmlFor="bio">Bio</Label>
  <Textarea
    id="bio"
    name="bio"
    defaultValue={profile.bio || ""}
    rows={4}
  />
</div>
```

**Step 4: Update Server Action**
```typescript
// lib/actions/profile.ts
export async function updateProfile(data: Partial<Profile>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone: data.phone,
      bio: data.bio, // Add this
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) throw error
  return { success: true }
}
```

---

### 2. Add a New Quick Tile

**Step 1: Add to QuickTiles Component**
```tsx
// components/profile/quick-tiles.tsx
const tiles = [
  // ... existing tiles
  {
    icon: Star,
    label: "Reviews",
    count: summary.reviews_count,
    href: "/profile/reviews",
  },
]
```

**Step 2: Update Summary Type**
```typescript
// lib/types/database.ts
export interface ProfileSummary {
  // ... existing fields
  reviews_count: number
}
```

**Step 3: Update Summary Action**
```typescript
// lib/actions/profile.ts
export async function getProfileSummary(): Promise<ProfileSummary | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const [orders, wishlist, wallet, coupons, notifications, reviews] = await Promise.all([
    // ... existing queries
    supabase.from("reviews").select("id", { count: "exact" }).eq("user_id", user.id),
  ])

  return {
    // ... existing fields
    reviews_count: reviews.count || 0,
  }
}
```

---

### 3. Add a New Profile Page

**Step 1: Create Page File**
```tsx
// app/profile/reviews/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews")
        const data = await res.json()
        setReviews(data)
      } catch (error) {
        console.error("Failed to load reviews", error)
      } finally {
        setLoading(false)
      }
    }
    loadReviews()
  }, [])

  if (loading) return <Skeleton className="h-96 w-full" />

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Reviews</h2>
      {/* Your content */}
    </div>
  )
}
```

**Step 2: Add to Navigation**
```tsx
// components/profile/profile-nav.tsx
const navItems = [
  // ... existing items
  { href: "/profile/reviews", label: "Reviews", icon: Star },
]
```

**Step 3: Create API Route**
```typescript
// app/api/reviews/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
```

---

### 4. Add Form Validation

**Step 1: Create Zod Schema**
```typescript
// lib/validations/profile.ts
export const reviewSchema = z.object({
  product_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(500),
})
```

**Step 2: Use in Component**
```tsx
import { reviewSchema } from "@/lib/validations/profile"

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  
  const data = {
    product_id: formData.get("product_id") as string,
    rating: Number(formData.get("rating")),
    comment: formData.get("comment") as string,
  }

  try {
    reviewSchema.parse(data) // Validate
    // Submit data
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      console.error(error.errors)
    }
  }
}
```

---

### 5. Add Server-Side Validation

```typescript
// app/api/reviews/route.ts
import { reviewSchema } from "@/lib/validations/profile"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = reviewSchema.parse(body)
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("reviews")
      .insert({
        ...validatedData,
        user_id: user.id,
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
```

---

## 🎨 Styling Guidelines

### Use Existing Components
```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
```

### Consistent Spacing
```tsx
<div className="space-y-6">  {/* Vertical spacing */}
  <div className="flex gap-4"> {/* Horizontal spacing */}
    {/* Content */}
  </div>
</div>
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

---

## 🔍 Debugging Tips

### Check Supabase Connection
```typescript
const supabase = await createClient()
const { data, error } = await supabase.from("profiles").select("*").limit(1)
console.log("Supabase test:", { data, error })
```

### Log API Responses
```typescript
const res = await fetch("/api/profile")
const data = await res.json()
console.log("API response:", data)
```

### Check Authentication
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log("Current user:", user)
```

---

## 📊 Performance Tips

### Use Skeleton Loaders
```tsx
if (loading) {
  return <Skeleton className="h-32 w-full" />
}
```

### Optimize Images
```tsx
import Image from "next/image"

<Image
  src={imageUrl}
  alt="Description"
  width={400}
  height={300}
  className="object-cover"
/>
```

### Prefetch Links
```tsx
import Link from "next/link"

<Link href="/profile/orders" prefetch>
  View Orders
</Link>
```

---

## 🧪 Testing Guidelines

### Component Test Template
```tsx
import { render, screen } from "@testing-library/react"
import { YourComponent } from "@/components/your-component"

describe("YourComponent", () => {
  it("renders correctly", () => {
    render(<YourComponent />)
    expect(screen.getByText("Expected Text")).toBeInTheDocument()
  })
})
```

### API Test Template
```typescript
import { GET } from "@/app/api/your-route/route"

describe("API Route", () => {
  it("returns data", async () => {
    const response = await GET()
    const data = await response.json()
    expect(data).toBeDefined()
  })
})
```

---

## 🔐 Security Best Practices

### Always Check Authentication
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

### Validate All Inputs
```typescript
import { z } from "zod"

const schema = z.object({
  field: z.string().min(1).max(100)
})

const validated = schema.parse(input)
```

### Use RLS Policies
```sql
-- Ensure users can only access their own data
CREATE POLICY "Users can view own data" ON table_name
FOR SELECT USING (auth.uid() = user_id);
```

---

## 📚 Useful Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Zod**: https://zod.dev

---

## 🆘 Common Issues

### Issue: "Module not found"
**Solution**: Run `npm install` and restart dev server

### Issue: "Unauthorized" errors
**Solution**: Check if user is logged in and session is valid

### Issue: Database query fails
**Solution**: Verify RLS policies and table permissions

### Issue: Type errors
**Solution**: Update TypeScript types in `lib/types/database.ts`

---

## 💡 Pro Tips

1. **Use TypeScript** - Catch errors before runtime
2. **Follow naming conventions** - kebab-case for files, PascalCase for components
3. **Keep components small** - Single responsibility principle
4. **Write tests** - Prevent regressions
5. **Document complex logic** - Help future you

---

**Happy Coding! 🚀**
