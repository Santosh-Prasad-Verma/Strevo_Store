import { Shield, Lock, Truck, RefreshCw } from "lucide-react"

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b">
      <div className="flex items-center gap-2 text-sm">
        <Shield className="w-5 h-5 text-green-600" />
        <span className="font-semibold">Secure Payment</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Lock className="w-5 h-5 text-blue-600" />
        <span className="font-semibold">SSL Encrypted</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Truck className="w-5 h-5 text-purple-600" />
        <span className="font-semibold">Free Shipping</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <RefreshCw className="w-5 h-5 text-orange-600" />
        <span className="font-semibold">Easy Returns</span>
      </div>
    </div>
  )
}
