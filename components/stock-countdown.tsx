import { AlertCircle } from "lucide-react"

export function StockCountdown({ stock }: { stock: number }) {
  if (stock > 10) return null

  return (
    <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
      <AlertCircle className="w-4 h-4" />
      <span>Only {stock} left in stock!</span>
    </div>
  )
}
