"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createAddress, updateAddress } from "@/lib/actions/addresses"
import { toast } from "sonner"
import type { Address } from "@/lib/types/database"

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  address?: Address | null
}

export function AddressFormDialog({ open, onOpenChange, address }: AddressFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isDefault, setIsDefault] = useState(address?.is_default || false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      address_type: formData.get("address_type") as "shipping" | "billing",
      full_name: formData.get("full_name") as string,
      address_line1: formData.get("address_line1") as string,
      address_line2: formData.get("address_line2") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postal_code: formData.get("postal_code") as string,
      country: formData.get("country") as string,
      phone: formData.get("phone") as string,
      is_default: isDefault,
    }

    try {
      if (address) {
        await updateAddress(address.id, data)
        toast.success("Address updated")
      } else {
        await createAddress(data)
        toast.success("Address added")
      }
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to save address")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="address_type">Address Type</Label>
            <Select name="address_type" defaultValue={address?.address_type || "shipping"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" name="full_name" defaultValue={address?.full_name} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={address?.phone || ""} />
          </div>
          <div>
            <Label htmlFor="address_line1">Address Line 1</Label>
            <Input id="address_line1" name="address_line1" defaultValue={address?.address_line1} required />
          </div>
          <div>
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input id="address_line2" name="address_line2" defaultValue={address?.address_line2 || ""} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={address?.city} required />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" defaultValue={address?.state} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input id="postal_code" name="postal_code" defaultValue={address?.postal_code} required />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" defaultValue={address?.country || "India"} required />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_default" checked={isDefault} onCheckedChange={(checked) => setIsDefault(checked as boolean)} />
            <Label htmlFor="is_default" className="cursor-pointer">Set as default address</Label>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-none">
              {loading ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
