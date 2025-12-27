"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const options = [
  { id: "monogram", name: "Monogramming", price: 199 },
  { id: "embroidery", name: "Custom Embroidery", price: 299 },
  { id: "patch", name: "Patch Application", price: 149 }
]

export function CustomizationOptions({ productId }: { productId: string }) {
  const [selected, setSelected] = useState("")
  const [text, setText] = useState("")

  const addCustomization = async () => {
    await fetch("/api/customizations", {
      method: "POST",
      body: JSON.stringify({
        productId,
        type: selected,
        text,
        price: options.find(o => o.id === selected)?.price
      })
    })
  }

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="font-bold text-lg">Customize Your Item</h3>
      
      <div className="space-y-2">
        {options.map(opt => (
          <label key={opt.id} className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-neutral-50">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="customization"
                value={opt.id}
                checked={selected === opt.id}
                onChange={(e) => setSelected(e.target.value)}
              />
              <span>{opt.name}</span>
            </div>
            <span className="font-semibold">+₹{opt.price}</span>
          </label>
        ))}
      </div>

      {selected && (
        <div className="space-y-3">
          <Input
            placeholder="Enter text (max 10 characters)"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 10))}
            maxLength={10}
          />
          <Button onClick={addCustomization} disabled={!text} className="w-full">
            Add Customization
          </Button>
        </div>
      )}
    </div>
  )
}
