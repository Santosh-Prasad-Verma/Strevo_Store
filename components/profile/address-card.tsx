"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Edit, Trash2, Star } from "lucide-react"
import type { Address } from "@/lib/types/database"

interface AddressCardProps {
  address: Address
  onEdit: (address: Address) => void
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className="border rounded-none p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium uppercase text-xs tracking-wider">{address.address_type}</span>
          {address.is_default && (
            <Badge variant="secondary" className="gap-1">
              <Star className="h-3 w-3" />
              Default
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-1 text-sm mb-4">
        <p className="font-medium">{address.full_name}</p>
        <p className="text-muted-foreground">{address.address_line1}</p>
        {address.address_line2 && <p className="text-muted-foreground">{address.address_line2}</p>}
        <p className="text-muted-foreground">
          {address.city}, {address.state} {address.postal_code}
        </p>
        {address.phone && <p className="text-muted-foreground">Phone: {address.phone}</p>}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(address)}
          className="rounded-none"
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        {!address.is_default && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(address.id)}
            className="rounded-none"
          >
            Set Default
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(address.id)}
          className="rounded-none text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
