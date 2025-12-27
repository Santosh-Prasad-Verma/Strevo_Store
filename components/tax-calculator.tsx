"use client"

interface Props {
  subtotal: number
  gstRate?: number
}

export function TaxCalculator({ subtotal, gstRate = 18 }: Props) {
  const gst = (subtotal * gstRate) / 100
  const cgst = gst / 2
  const sgst = gst / 2
  const total = subtotal + gst

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <h3 className="font-semibold mb-3">Price Breakdown</h3>
      
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between text-sm text-neutral-600">
        <span>CGST ({gstRate / 2}%)</span>
        <span>₹{cgst.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between text-sm text-neutral-600">
        <span>SGST ({gstRate / 2}%)</span>
        <span>₹{sgst.toFixed(2)}</span>
      </div>
      
      <div className="border-t pt-2 flex justify-between font-bold">
        <span>Total (incl. GST)</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
