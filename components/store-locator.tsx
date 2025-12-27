"use client"

import { useEffect, useState } from "react"
import { MapPin, Phone, Clock } from "lucide-react"

interface Store {
  id: string
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  hours: string
  latitude: number
  longitude: number
}

export function StoreLocator() {
  const [stores, setStores] = useState<Store[]>([])
  const [city, setCity] = useState("")

  useEffect(() => {
    fetch("/api/stores")
      .then(r => r.json())
      .then(data => setStores(data.stores || []))
  }, [])

  const filteredStores = city
    ? stores.filter(s => s.city.toLowerCase().includes(city.toLowerCase()))
    : stores

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Find a Store</h2>
        <input
          type="text"
          placeholder="Search by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredStores.map(store => (
          <div key={store.id} className="border rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-bold">{store.name}</h3>
            
            <div className="flex gap-2 text-neutral-600">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <div>
                <p>{store.address}</p>
                <p>{store.city}, {store.state} - {store.pincode}</p>
              </div>
            </div>

            {store.phone && (
              <div className="flex gap-2 text-neutral-600">
                <Phone className="w-5 h-5" />
                <p>{store.phone}</p>
              </div>
            )}

            {store.hours && (
              <div className="flex gap-2 text-neutral-600">
                <Clock className="w-5 h-5" />
                <p>{store.hours}</p>
              </div>
            )}

            <a
              href={`https://maps.google.com/?q=${store.latitude},${store.longitude}`}
              target="_blank"
              className="inline-block text-blue-600 hover:underline"
            >
              Get Directions →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
