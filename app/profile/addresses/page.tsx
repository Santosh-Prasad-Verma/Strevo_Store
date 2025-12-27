"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AddressCard } from "@/components/profile/address-card"
import { AddressFormDialog } from "@/components/profile/address-form-dialog"
import { deleteAddress, setDefaultAddress } from "@/lib/actions/addresses"
import { toast } from "sonner"
import { Plus, MapPin } from "lucide-react"
import type { Address } from "@/lib/types/database"

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  async function loadAddresses() {
    try {
      const res = await fetch("/api/addresses")
      const data = await res.json()
      setAddresses(data)
    } catch (error) {
      console.error("Failed to load addresses", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAddresses()
  }, [dialogOpen])

  async function handleDelete(id: string) {
    if (!confirm("Delete this address?")) return
    try {
      await deleteAddress(id)
      toast.success("Address deleted")
      loadAddresses()
    } catch (error) {
      toast.error("Failed to delete address")
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress(id)
      toast.success("Default address updated")
      loadAddresses()
    } catch (error) {
      toast.error("Failed to update default address")
    }
  }

  function handleEdit(address: Address) {
    setEditingAddress(address)
    setDialogOpen(true)
  }

  function handleAdd() {
    setEditingAddress(null)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Saved Addresses</h2>
        <Button onClick={handleAdd} className="rounded-none">
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white border rounded-none p-12 text-center">
          <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No addresses saved</h3>
          <p className="text-muted-foreground mb-6">Add an address for faster checkout</p>
          <Button onClick={handleAdd} className="rounded-none">
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
      />
    </div>
  )
}
