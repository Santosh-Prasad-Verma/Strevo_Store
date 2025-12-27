import { OutfitBuilder } from "@/components/outfit-builder"

export default function OutfitBuilderPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Build Your Outfit</h1>
      <OutfitBuilder />
    </div>
  )
}
