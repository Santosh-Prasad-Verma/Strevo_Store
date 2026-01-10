"use client"

import { useState } from "react"
import { ProductImageGallery } from "@/components/pdp/product-image-gallery"
import { SizeSelector } from "@/components/pdp/size-selector"
import { SizeChart } from "@/components/pdp/size-chart"
import { PincodeChecker } from "@/components/pdp/pincode-checker"
import { WishlistButton } from "@/components/pdp/wishlist-button"
import { OffersSection } from "@/components/pdp/offers-section"
import { StickyAddToCart } from "@/components/pdp/sticky-add-to-cart"
import { YouMayLike } from "@/components/pdp/you-may-like"
import { RecentlyViewed } from "@/components/pdp/recently-viewed"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { formatINR } from "@/lib/utils/currency"
import { useRecentlyViewed } from "@/lib/hooks/use-recently-viewed"
import type { Product } from "@/lib/types/database"
import { ChevronDown, Truck, Package, Shield } from "lucide-react"

interface ProductDetailClientProps {
  product: Product
  allImages: string[]
  relatedProducts: Product[]
}

export function ProductDetailClient({ product, allImages, relatedProducts }: ProductDetailClientProps) {
  useRecentlyViewed(product)
  const [openSection, setOpenSection] = useState<string | null>(null)
  
  const getSizes = () => {
    if (product.size_type === 'none' || !product.available_sizes) return []
    return product.available_sizes.map(size => ({ value: size, available: true }))
  }
  
  const sizes = getSizes()
  
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }



  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <ProductImageGallery images={allImages} productName={product.name} />

          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
              

            </div>

            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold">{formatINR(product.price)}</p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y">
              <div className="flex flex-col items-center text-center">
                <Package className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">Premium Quality</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Truck className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium">Easy Returns</span>
              </div>
            </div>

            {sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Select Size</span>
                  <SizeChart sizeType={product.size_type} />
                </div>
                <SizeSelector sizes={sizes} onSizeSelect={(size) => console.log('Size selected:', size)} />
              </div>
            )}

            <div className="flex gap-3">
              <AddToCartButton productId={product.id} className="flex-1 rounded-none" />
              <WishlistButton productId={product.id} />
            </div>

            <OffersSection />

            {/* Collapsible Sections */}
            <div className="space-y-2">
              {/* Description */}
              <div className="border">
                <button
                  onClick={() => toggleSection('description')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-medium">Product Description</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openSection === 'description' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'description' && (
                  <div className="p-4 pt-0 text-sm text-muted-foreground whitespace-pre-line">
                    {product.description}
                  </div>
                )}
              </div>

              {/* Delivery Options */}
              <div className="border">
                <button
                  onClick={() => toggleSection('delivery')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <span className="font-medium">Delivery Options</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openSection === 'delivery' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'delivery' && (
                  <div className="p-4 pt-0">
                    <PincodeChecker />
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        <span>Free delivery on orders above ₹999</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>Standard delivery: 5-7 business days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Easy 7-day return & exchange</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Size Guide */}
              {sizes.length > 0 && (
                <div className="border">
                  <button
                    onClick={() => toggleSection('sizeguide')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <span className="font-medium">Size Guide</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${openSection === 'sizeguide' ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === 'sizeguide' && (
                    <div className="p-4 pt-0 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3">Size</th>
                            <th className="text-left py-2 px-3">Chest Width</th>
                            <th className="text-left py-2 px-3">Body Length</th>
                            <th className="text-left py-2 px-3">Shoulder Width</th>
                            <th className="text-left py-2 px-3">Sleeve Length</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-3 font-medium">S</td>
                            <td className="py-2 px-3">22"</td>
                            <td className="py-2 px-3">27.5"</td>
                            <td className="py-2 px-3">20.5"</td>
                            <td className="py-2 px-3">9"</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-3 font-medium">M</td>
                            <td className="py-2 px-3">23"</td>
                            <td className="py-2 px-3">28.5"</td>
                            <td className="py-2 px-3">21.5"</td>
                            <td className="py-2 px-3">9.5"</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-3 font-medium">L</td>
                            <td className="py-2 px-3">24"</td>
                            <td className="py-2 px-3">29.5"</td>
                            <td className="py-2 px-3">22.5"</td>
                            <td className="py-2 px-3">9.5"</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-3 font-medium">XL</td>
                            <td className="py-2 px-3">25"</td>
                            <td className="py-2 px-3">30.5"</td>
                            <td className="py-2 px-3">23.5"</td>
                            <td className="py-2 px-3">10"</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-medium">XXL</td>
                            <td className="py-2 px-3">26"</td>
                            <td className="py-2 px-3">31.5"</td>
                            <td className="py-2 px-3">24.5"</td>
                            <td className="py-2 px-3">10.5"</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <YouMayLike products={relatedProducts} />
        <RecentlyViewed currentProductId={product.id} />
      </div>

      <StickyAddToCart
        productName={product.name}
        price={product.price}
        onAddToCart={() => {}}
      />
    </div>
  )
}
