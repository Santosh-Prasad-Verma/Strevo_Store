export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 uppercase tracking-wider">Size Guide</h1>
      <p className="text-gray-600 mb-6">Find your perfect fit with our size guide.</p>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Size</th>
              <th className="border p-3">Chest (inches)</th>
              <th className="border p-3">Waist (inches)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border p-3">S</td><td className="border p-3">36-38</td><td className="border p-3">28-30</td></tr>
            <tr><td className="border p-3">M</td><td className="border p-3">38-40</td><td className="border p-3">30-32</td></tr>
            <tr><td className="border p-3">L</td><td className="border p-3">40-42</td><td className="border p-3">32-34</td></tr>
            <tr><td className="border p-3">XL</td><td className="border p-3">42-44</td><td className="border p-3">34-36</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
