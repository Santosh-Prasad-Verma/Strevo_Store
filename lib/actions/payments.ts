"use server"

import { createClient } from "@/lib/supabase/server"

export async function createBNPLPlan(orderId: string, installments: number, amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const installmentAmount = amount / installments

  const { error } = await supabase.from("bnpl_plans").insert({
    order_id: orderId,
    user_id: user.id,
    total_amount: amount,
    installments,
    installment_amount: installmentAmount
  })

  if (error) throw error
}

export async function savePaymentMethod(type: string, lastFour: string, provider: string, token: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from("saved_payment_methods").insert({
    user_id: user.id,
    type,
    last_four: lastFour,
    provider,
    token
  })

  if (error) throw error
}

export async function generateInvoice(orderId: string, subtotal: number, taxAmount: number) {
  const supabase = await createClient()
  
  const invoiceNumber = `INV-${Date.now()}`
  const total = subtotal + taxAmount

  const { error } = await supabase.from("invoices").insert({
    order_id: orderId,
    invoice_number: invoiceNumber,
    subtotal,
    tax_amount: taxAmount,
    total
  })

  if (error) throw error
  return invoiceNumber
}
