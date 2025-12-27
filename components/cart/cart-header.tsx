export function CartHeader({ itemCount }: { itemCount: number }) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Shopping Bag ({itemCount})</h1>
          
          {/* Steps Indicator */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-medium">1</div>
              <span className="font-medium">BAG</span>
            </div>
            <div className="w-12 h-px bg-neutral-300"></div>
            <div className="flex items-center gap-2 text-neutral-400">
              <div className="w-8 h-8 rounded-full border-2 border-neutral-300 flex items-center justify-center">2</div>
              <span>ADDRESS</span>
            </div>
            <div className="w-12 h-px bg-neutral-300"></div>
            <div className="flex items-center gap-2 text-neutral-400">
              <div className="w-8 h-8 rounded-full border-2 border-neutral-300 flex items-center justify-center">3</div>
              <span>PAYMENT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
