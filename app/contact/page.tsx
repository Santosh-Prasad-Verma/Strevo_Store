"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">We're Here to Help</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            At Strevo Store, every detail matters. Whether you have a question about your order, need styling advice, or want to connect with our team, we're here to assist you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-gray-600">support@strevostore.com</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Business Address</h3>
                  <p className="text-gray-600">
                    Strevo Store<br />
                    [Your Street Address]<br />
                    [City, State, PIN Code]<br />
                    India
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <p className="text-gray-600">+91 [Your Phone Number]</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Working Hours</h3>
                  <p className="text-gray-600">
                    Monday – Friday: 10:00 AM – 7:00 PM IST<br />
                    Saturday: 10:00 AM – 5:00 PM IST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">How Can We Assist You?</h2>
              <div className="space-y-3 text-gray-700">
                <div>
                  <h3 className="font-medium">Order Inquiries</h3>
                  <p className="text-sm">Track your order, modify shipping details, or check order status.</p>
                </div>
                <div>
                  <h3 className="font-medium">Returns & Exchanges</h3>
                  <p className="text-sm">Questions about our return policy, exchange process, or refund status.</p>
                </div>
                <div>
                  <h3 className="font-medium">Payment Issues</h3>
                  <p className="text-sm">Payment failures, transaction concerns, or billing questions.</p>
                </div>
                <div>
                  <h3 className="font-medium">Product Information</h3>
                  <p className="text-sm">Sizing guidance, fabric details, care instructions, or styling advice.</p>
                </div>
                <div>
                  <h3 className="font-medium">Partnerships</h3>
                  <p className="text-sm">Collaboration opportunities, wholesale inquiries, or brand partnerships.</p>
                </div>
                <div>
                  <h3 className="font-medium">Press & Media</h3>
                  <p className="text-sm">Media requests, press kits, or interview opportunities.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required className="mt-2" />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required className="mt-2" />
              </div>

              <div>
                <Label htmlFor="order">Order Number (Optional)</Label>
                <Input id="order" name="order" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select name="subject">
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order Inquiry</SelectItem>
                    <SelectItem value="return">Return Request</SelectItem>
                    <SelectItem value="product">Product Question</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required className="mt-2" rows={6} />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-black text-white hover:bg-gray-800">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
              We aim to respond to all inquiries within 24 hours during business days.
            </p>
          </div>
        </div>

        <div className="border-t pt-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Visit Our Store</h3>
              <p className="text-gray-600">
                Currently, Strevo Store operates exclusively online. Follow us on social media for updates on potential pop-up locations and events.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
              <p className="text-gray-600 mb-3">
                Stay connected for new releases, exclusive drops, and behind-the-scenes content.
              </p>
              <div className="space-y-1 text-gray-700">
                <p>Instagram: @strevostore</p>
                <p>Twitter: @strevostore</p>
                <p>Facebook: /strevostore</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Feedback</h3>
            <p className="text-gray-600">
              Your opinion matters. Share your experience or suggestions at feedback@strevostore.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
