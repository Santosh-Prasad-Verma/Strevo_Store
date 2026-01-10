"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Check } from "lucide-react"
import { toast } from "sonner"

interface ShippingFormProps {
  onComplete: (data: any) => void
  deliveryOption: 'standard' | 'express'
  onDeliveryChange: (option: 'standard' | 'express') => void
}

export function ShippingForm({ onComplete, deliveryOption, onDeliveryChange }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  })
  const [errors, setErrors] = useState<any>({})
  const [pincodeValid, setPincodeValid] = useState(false)

  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone)
  const validatePincode = (pin: string) => /^\d{6}$/.test(pin)

  const checkPincode = async () => {
    if (validatePincode(formData.pincode)) {
      setPincodeValid(true)
      toast.success("Delivery available to this pincode")
    } else {
      toast.error("Invalid pincode")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: any = {}

    const sanitizedData = {
      fullName: formData.fullName.trim().replace(/[<>"']/g, ''),
      phone: formData.phone,
      pincode: formData.pincode,
      addressLine1: formData.addressLine1.trim().replace(/[<>"']/g, ''),
      addressLine2: formData.addressLine2.trim().replace(/[<>"']/g, ''),
      city: formData.city.trim().replace(/[<>"']/g, ''),
      state: formData.state.trim().replace(/[<>"']/g, ''),
      postalCode: formData.postalCode,
      country: formData.country,
    }

    if (!sanitizedData.fullName) newErrors.fullName = "Required"
    if (!sanitizedData.phone || !validatePhone(sanitizedData.phone)) newErrors.phone = "Invalid phone number"
    if (!sanitizedData.pincode || !validatePincode(sanitizedData.pincode)) newErrors.pincode = "Invalid pincode"
    if (!sanitizedData.addressLine1) newErrors.addressLine1 = "Required"
    if (!sanitizedData.city) newErrors.city = "Required"
    if (!sanitizedData.state) newErrors.state = "Required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onComplete(sanitizedData)
    toast.success("Address saved")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg border border-neutral-200 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
          2
        </div>
        <h2 className="text-lg font-medium tracking-tight">DELIVERY ADDRESS</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              FULL NAME *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value })
                setErrors({ ...errors, fullName: undefined })
              }}
              className={`w-full px-3 py-2.5 text-sm border ${errors.fullName ? 'border-red-500' : 'border-neutral-300'} rounded focus:outline-none focus:border-black transition-colors`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{String(errors.fullName)}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              PHONE NUMBER *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
                setErrors({ ...errors, phone: undefined })
              }}
              className={`w-full px-3 py-2.5 text-sm border ${errors.phone ? 'border-red-500' : 'border-neutral-300'} rounded focus:outline-none focus:border-black transition-colors`}
              placeholder="10-digit mobile number"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{String(errors.phone)}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            PINCODE *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => {
                const newPincode = e.target.value.replace(/\D/g, '').slice(0, 6)
                setFormData({ ...formData, pincode: newPincode, postalCode: newPincode })
                setErrors({ ...errors, pincode: undefined })
              }}
              className={`flex-1 px-3 py-2.5 text-sm border ${errors.pincode ? 'border-red-500' : 'border-neutral-300'} rounded focus:outline-none focus:border-black transition-colors`}
              placeholder="6-digit pincode"
            />
            <button
              type="button"
              onClick={checkPincode}
              className="px-4 py-2.5 text-xs font-medium border border-black hover:bg-black hover:text-white transition-colors rounded"
            >
              CHECK
            </button>
          </div>
          {pincodeValid && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> Delivery available</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            ADDRESS LINE 1 *
          </label>
          <input
            type="text"
            value={formData.addressLine1}
            onChange={(e) => {
              setFormData({ ...formData, addressLine1: e.target.value })
              setErrors({ ...errors, addressLine1: undefined })
            }}
            className={`w-full px-3 py-2.5 text-sm border ${errors.addressLine1 ? 'border-red-500' : 'border-neutral-300'} rounded focus:outline-none focus:border-black transition-colors`}
            placeholder="House No., Building Name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            ADDRESS LINE 2
          </label>
          <input
            type="text"
            value={formData.addressLine2}
            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
            className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded focus:outline-none focus:border-black transition-colors"
            placeholder="Road Name, Area, Colony"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              CITY *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => {
                setFormData({ ...formData, city: e.target.value })
                setErrors({ ...errors, city: undefined })
              }}
              className={`w-full px-3 py-2.5 text-sm border ${errors.city ? 'border-red-500' : 'border-neutral-300'} rounded focus:outline-none focus:border-black transition-colors`}
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              STATE *
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => {
                setFormData({ ...formData, state: e.target.value })
                setErrors({ ...errors, state: undefined })
              }}
              className={`w-full px-3 py-2.5 text-sm border ${errors.state ? 'border-red-500' : 'border-neutral-300'} rounded focus:outline-none focus:border-black transition-colors`}
              placeholder="State"
            />
          </div>
        </div>

        {/* Delivery Options */}
        <div className="pt-4 border-t border-neutral-200">
          <h3 className="text-sm font-medium mb-3">DELIVERY SPEED</h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 border border-neutral-300 rounded cursor-pointer hover:border-black transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={deliveryOption === 'standard'}
                  onChange={() => onDeliveryChange('standard')}
                  className="w-4 h-4"
                />
                <div>
                  <p className="text-sm font-medium">Standard Delivery</p>
                  <p className="text-xs text-neutral-500">3-5 business days</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">FREE</span>
            </label>

            <label className="flex items-center justify-between p-3 border border-neutral-300 rounded cursor-pointer hover:border-black transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={deliveryOption === 'express'}
                  onChange={() => onDeliveryChange('express')}
                  className="w-4 h-4"
                />
                <div>
                  <p className="text-sm font-medium">Express Delivery</p>
                  <p className="text-xs text-neutral-500">1-2 business days</p>
                </div>
              </div>
              <span className="text-sm font-medium">₹99</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded font-medium text-sm hover:bg-neutral-800 transition-colors"
        >
          CONTINUE TO PAYMENT
        </button>
      </form>
    </motion.div>
  )
}
