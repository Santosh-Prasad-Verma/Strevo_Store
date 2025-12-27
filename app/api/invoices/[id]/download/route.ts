import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, orders(*)")
    .eq("order_id", params.id)
    .single()

  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Generate simple PDF content
  const pdfContent = `
    INVOICE #${invoice.invoice_number}
    
    Order ID: ${invoice.order_id}
    Date: ${new Date(invoice.created_at).toLocaleDateString()}
    
    Subtotal: ₹${invoice.subtotal}
    Tax: ₹${invoice.tax_amount}
    Total: ₹${invoice.total}
  `

  return new NextResponse(pdfContent, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${invoice.invoice_number}.pdf"`
    }
  })
}
