"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Truck, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function PincodeChecker() {
  const [pincode, setPincode] = useState("")
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<{ available: boolean; days?: number } | null>(null)

  const handleCheck = async () => {
    if (pincode.length !== 6) return
    setChecking(true)
    
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    setResult({
      available: true,
      days: Math.floor(Math.random() * 3) + 2,
    })
    setChecking(false)
  }

  return (
    <div className="space-y-3 border-t pt-6">
      <h3 className="text-sm font-medium uppercase tracking-wider">Delivery Options</h3>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6)
            setPincode(value)
            setResult(null)
          }}
          maxLength={6}
          className="flex-1"
        />
        <Button
          onClick={handleCheck}
          disabled={pincode.length !== 6 || checking}
          variant="outline"
          className="rounded-none"
        >
          {checking ? "Checking..." : "Check"}
        </Button>
      </div>
      
      {result && (
        <div className={cn(
          "flex items-start gap-2 p-3 text-sm",
          result.available ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
        )}>
          {result.available ? (
            <>
              <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Delivery Available</p>
                <p className="text-xs mt-1 flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  Estimated delivery in {Number(result.days)}-{Number(result.days || 0) + 2} days
                </p>
              </div>
            </>
          ) : (
            <>
              <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>Delivery not available for this pincode</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
