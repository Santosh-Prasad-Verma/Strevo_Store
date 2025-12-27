export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 uppercase tracking-wider">FAQ</h1>
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-2">How do I place an order?</h3>
          <p className="text-gray-600">Browse our products, add items to cart, and proceed to checkout.</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">What payment methods do you accept?</h3>
          <p className="text-gray-600">We accept all major credit cards, debit cards, and UPI payments.</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">How long does shipping take?</h3>
          <p className="text-gray-600">Standard shipping takes 5-7 business days within India.</p>
        </div>
      </div>
    </div>
  )
}
