"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface Props {
  orderId: string
  invoiceNumber: string
}

export function InvoiceGenerator({ orderId, invoiceNumber }: Props) {
  const downloadInvoice = async () => {
    const res = await fetch(`/api/invoices/${orderId}/download`)
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${invoiceNumber}.pdf`
    a.click()
  }

  return (
    <Button onClick={downloadInvoice} variant="outline" size="sm">
      <Download className="w-4 h-4 mr-2" />
      Download Invoice
    </Button>
  )
}
