"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Ruler } from "lucide-react"

interface SizeChartProps {
  sizeType?: 'clothing' | 'shoes' | 'onesize' | 'none'
}

export function SizeChart({ sizeType = 'clothing' }: SizeChartProps) {
  if (sizeType === 'none' || sizeType === 'onesize') return null

  return (
    <Dialog key={`size-chart-${sizeType}`}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-sm underline">
          <Ruler className="w-4 h-4 mr-1" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-none">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">Size Guide</DialogTitle>
        </DialogHeader>
        
        {sizeType === 'clothing' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Clothing Sizes</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Size</th>
                  <th className="border p-2">Chest (inches)</th>
                  <th className="border p-2">Waist (inches)</th>
                  <th className="border p-2">Hip (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">XS</td><td className="border p-2">32-34</td><td className="border p-2">26-28</td><td className="border p-2">34-36</td></tr>
                <tr><td className="border p-2">S</td><td className="border p-2">34-36</td><td className="border p-2">28-30</td><td className="border p-2">36-38</td></tr>
                <tr><td className="border p-2">M</td><td className="border p-2">38-40</td><td className="border p-2">30-32</td><td className="border p-2">38-40</td></tr>
                <tr><td className="border p-2">L</td><td className="border p-2">42-44</td><td className="border p-2">34-36</td><td className="border p-2">42-44</td></tr>
                <tr><td className="border p-2">XL</td><td className="border p-2">46-48</td><td className="border p-2">38-40</td><td className="border p-2">46-48</td></tr>
                <tr><td className="border p-2">XXL</td><td className="border p-2">50-52</td><td className="border p-2">42-44</td><td className="border p-2">50-52</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {sizeType === 'shoes' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Shoe Sizes</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">UK</th>
                  <th className="border p-2">US</th>
                  <th className="border p-2">EU</th>
                  <th className="border p-2">CM</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">5</td><td className="border p-2">6</td><td className="border p-2">38</td><td className="border p-2">23.5</td></tr>
                <tr><td className="border p-2">6</td><td className="border p-2">7</td><td className="border p-2">39</td><td className="border p-2">24.5</td></tr>
                <tr><td className="border p-2">7</td><td className="border p-2">8</td><td className="border p-2">40</td><td className="border p-2">25.5</td></tr>
                <tr><td className="border p-2">8</td><td className="border p-2">9</td><td className="border p-2">42</td><td className="border p-2">26.5</td></tr>
                <tr><td className="border p-2">9</td><td className="border p-2">10</td><td className="border p-2">43</td><td className="border p-2">27.5</td></tr>
                <tr><td className="border p-2">10</td><td className="border p-2">11</td><td className="border p-2">44</td><td className="border p-2">28.5</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
