"use client"

import { useEffect, useState } from "react"
import { CreditCard, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SavedCard {
  id: string
  type: string
  last_four: string
  provider: string
  is_default: boolean
}

export function SavedCards({ onSelect }: { onSelect: (id: string) => void }) {
  const [cards, setCards] = useState<SavedCard[]>([])
  const [selected, setSelected] = useState("")

  useEffect(() => {
    fetch("/api/payment-methods")
      .then(r => r.json())
      .then(data => setCards(data.methods || []))
  }, [])

  const handleSelect = (id: string) => {
    setSelected(id)
    onSelect(id)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Saved Cards</h3>
      {cards.map(card => (
        <div
          key={card.id}
          onClick={() => handleSelect(card.id)}
          className={`border rounded-lg p-4 cursor-pointer transition ${selected === card.id ? "border-black bg-neutral-50" : "border-neutral-200"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              <div>
                <p className="font-semibold">{card.provider}</p>
                <p className="text-sm text-neutral-600">•••• {card.last_four}</p>
              </div>
            </div>
            {card.is_default && <span className="text-xs bg-black text-white px-2 py-1 rounded">Default</span>}
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add New Card
      </Button>
    </div>
  )
}
