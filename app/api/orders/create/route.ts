import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { clearCart } from "@/lib/actions/cart"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { shippingDetails, cartItems, total } = await request.json()

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: "pending",
        subtotal: total,
        total: total,
        total_amount: total,
        shipping_full_name: shippingDetails.fullName,
        shipping_address_line1: shippingDetails.addressLine1 || shippingDetails.address1,
        shipping_address_line2: shippingDetails.addressLine2 || shippingDetails.address2 || '',
        shipping_city: shippingDetails.city,
        shipping_state: shippingDetails.state,
        shipping_postal_code: shippingDetails.postalCode || shippingDetails.pincode,
        shipping_country: shippingDetails.country || 'India',
        shipping_phone: shippingDetails.phone,
        payment_status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Error creating order:", orderError)
      throw orderError
    }

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.products.name,
      product_image_url: item.products.image_url,
      quantity: item.quantity,
      unit_price: item.products.price,
      total_price: item.products.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("[v0] Error creating order items:", itemsError)
      throw itemsError
    }

    // Reduce stock for each product
    for (const item of cartItems) {
      const { data: product } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .single()

      if (product) {
        await supabase
          .from("products")
          .update({ stock_quantity: product.stock_quantity - item.quantity })
          .eq("id", item.product_id)
      }
    }

    // Clear cart
    await clearCart()

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error("[v0] Error in create order API:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
