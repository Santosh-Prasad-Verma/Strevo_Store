"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ruler } from "lucide-react"

export function SizeGuideCalculator() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [chest, setChest] = useState("")
  const [waist, setWaist] = useState("")
  const [recommendedSize, setRecommendedSize] = useState("")

  const calculateSize = () => {
    const h = parseInt(height)
    const w = parseInt(weight)
    const c = parseInt(chest)

    if (h < 160 || w < 50 || c < 85) {
      setRecommendedSize("XS")
    } else if (h < 170 || w < 65 || c < 95) {
      setRecommendedSize("S")
    } else if (h < 180 || w < 75 || c < 100) {
      setRecommendedSize("M")
    } else if (h < 185 || w < 85 || c < 105) {
      setRecommendedSize("L")
    } else if (h < 190 || w < 95 || c < 110) {
      setRecommendedSize("XL")
    } else {
      setRecommendedSize("XXL")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Ruler className="w-4 h-4" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Size Guide & Calculator</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calculator */}
          <div className="space-y-4">
            <h3 className="font-semibold">Find Your Size</h3>
            <div>
              <Label>Height (cm)</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
              />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
              />
            </div>
            <div>
              <Label>Chest (cm)</Label>
              <Input
                type="number"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
                placeholder="95"
              />
            </div>
            <div>
              <Label>Waist (cm)</Label>
              <Input
                type="number"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                placeholder="80"
              />
            </div>
            <Button onClick={calculateSize} className="w-full">
              Calculate Size
            </Button>
            {recommendedSize && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                <p className="text-sm text-green-800 mb-1">Recommended Size</p>
                <p className="text-3xl font-bold text-green-900">{recommendedSize}</p>
              </div>
            )}
          </div>

          {/* Size Chart */}
          <div>
            <h3 className="font-semibold mb-4">Size Chart</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Size</th>
                    <th className="text-left p-2">Chest</th>
                    <th className="text-left p-2">Waist</th>
                    <th className="text-left p-2">Length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">XS</td>
                    <td className="p-2">85-90</td>
                    <td className="p-2">70-75</td>
                    <td className="p-2">68</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">S</td>
                    <td className="p-2">90-95</td>
                    <td className="p-2">75-80</td>
                    <td className="p-2">70</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">M</td>
                    <td className="p-2">95-100</td>
                    <td className="p-2">80-85</td>
                    <td className="p-2">72</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">L</td>
                    <td className="p-2">100-105</td>
                    <td className="p-2">85-90</td>
                    <td className="p-2">74</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">XL</td>
                    <td className="p-2">105-110</td>
                    <td className="p-2">90-95</td>
                    <td className="p-2">76</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">XXL</td>
                    <td className="p-2">110-115</td>
                    <td className="p-2">95-100</td>
                    <td className="p-2">78</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-neutral-600 mt-4">
              * All measurements are in centimeters
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
