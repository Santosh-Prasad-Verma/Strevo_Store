import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  console.log("=== Product Create API Called ===")
  try {
    console.log("Creating Supabase client...")
    const supabase = await createClient()
    console.log("Getting user...")
    const { data: { user } } = await supabase.auth.getUser()
    console.log("User:", user?.id)
    
    // Create admin client for storage uploads
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    if (!user) {
      console.error("No user found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Parsing form data...")
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const gender = formData.get("gender") as string
    const brand = formData.get("brand") as string || null
    const size_type = formData.get("size_type") as string
    const available_sizes_str = formData.get("available_sizes") as string
    const available_sizes = available_sizes_str ? available_sizes_str.split(",").map(s => s.trim()) : []
    const size_stocks_str = formData.get("size_stocks") as string
    const size_stocks = size_stocks_str ? JSON.parse(size_stocks_str) : {}
    const stock_quantity = size_type === "none" 
      ? parseInt(formData.get("stock_quantity") as string)
      : Object.values(size_stocks).reduce((sum: number, val) => sum + (val as number), 0)
    const imageCount = parseInt(formData.get("imageCount") as string)
    
    if (!name || !description || !category || !gender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (isNaN(price) || price <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 })
    }
    if (isNaN(stock_quantity) || stock_quantity < 0) {
      return NextResponse.json({ error: "Invalid stock quantity" }, { status: 400 })
    }
    
    console.log("Product data:", JSON.stringify({ name: name?.replace(/[\r\n]/g, ' '), price, category: category?.replace(/[\r\n]/g, ' '), gender: gender?.replace(/[\r\n]/g, ' '), size_type: size_type?.replace(/[\r\n]/g, ' '), stock_quantity }))

    console.log("Processing images...")
    const imageUrls: string[] = []

    for (let i = 0; i < imageCount; i++) {
      const image = formData.get(`image_${i}`) as File
      if (image && image.size > 0) {
        if (image.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: `Image ${i} exceeds 5MB limit` }, { status: 400 })
        }
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(image.type)) {
          return NextResponse.json({ error: `Image ${i} must be JPEG, PNG, or WebP` }, { status: 400 })
        }
        
        const fileExt = image.name.split('.').pop()
        const fileName = `products/${Date.now()}-${i}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('Media')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error(`Image ${i} upload error:`, uploadError?.message?.replace(/[\r\n]/g, ' '))
          throw uploadError
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('Media')
          .getPublicUrl(uploadData.path)

        imageUrls.push(publicUrl)
        console.log(`Image ${i} uploaded: ${publicUrl?.replace(/[\r\n]/g, ' ')}`)
      }
    }

    const image_url = imageUrls[0] || "/placeholder.svg"
    console.log("Image URL:", image_url?.replace(/[\r\n]/g, ' '))

    console.log("Inserting product into database...")
    const productData = {
      name,
      description,
      price,
      category,
      gender,
      brand,
      size_type,
      available_sizes,
      image_url,
      stock_quantity,
      is_active: true,
    }
    // TODO: Add size_stocks column to products table as jsonb type
    // size_stocks: size_type !== "none" ? size_stocks : null,
    console.log("Product data to insert:", JSON.stringify(productData)?.replace(/[\r\n]/g, ' '))
    
    const { data: product, error } = await supabaseAdmin
      .from("products")
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error("Product insert error:", error?.message?.replace(/[\r\n]/g, ' '))
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Insert additional images
    if (imageUrls.length > 1 && product) {
      const additionalImages = imageUrls.slice(1).map((url, index) => ({
        product_id: product.id,
        image_url: url,
        is_primary: false,
        display_order: index + 1,
      }))

      await supabaseAdmin.from("product_images").insert(additionalImages)
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("=== Product creation error ===")
    console.error("Error message:", error.message?.replace(/[\r\n]/g, ' '))
    console.error("Error stack:", error.stack?.replace(/[\r\n]/g, ' '))
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 })
  }
}
