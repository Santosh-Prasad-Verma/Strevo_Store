export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Refund & Return Policy</h1>
        <p className="text-sm text-gray-500 mb-12">Last Updated: November 23, 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            At Strevo Store, we stand behind the quality of our products. If you're not completely satisfied, we're here to help.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Return Eligibility</h2>
            
            <h3 className="text-xl font-medium mb-3 mt-6">Timeframe</h3>
            <p className="text-gray-700 leading-relaxed">
              Returns are accepted within 7 days of delivery.
            </p>

            <h3 className="text-xl font-medium mb-3 mt-6">Condition Requirements</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Items must be unworn, unwashed, and in original condition</li>
              <li>All original tags must be attached</li>
              <li>Products must be in original packaging</li>
              <li>No signs of wear, damage, or alteration</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Exchange Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We offer exchanges for different sizes or colors, subject to availability. Exchange requests must be made within 7 days of delivery.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              To request an exchange, contact us at returns@strevostore.com with your order number and preferred replacement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Eligible Items for Return</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Most products are eligible for return, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Apparel (t-shirts, hoodies, jackets, pants)</li>
              <li>Accessories (hats, bags, scarves)</li>
              <li>Footwear (unworn, in original box)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Non-Refundable Items</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              The following items cannot be returned:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Underwear and intimate apparel</li>
              <li>Earrings and pierced jewelry</li>
              <li>Final sale or clearance items</li>
              <li>Gift cards</li>
              <li>Customized or personalized products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Damaged or Incorrect Items</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you receive a damaged or incorrect item:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Contact us within 48 hours of delivery</li>
              <li>Provide photos of the damaged product</li>
              <li>We will arrange a replacement or full refund at no additional cost</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              We cover return shipping for our errors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Return Shipping</h2>
            
            <h3 className="text-xl font-medium mb-3 mt-6">Customer-Initiated Returns</h3>
            <p className="text-gray-700 leading-relaxed">
              Customers are responsible for return shipping costs unless the item is defective or we made an error.
            </p>

            <h3 className="text-xl font-medium mb-3 mt-6">Return Address</h3>
            <p className="text-gray-700 leading-relaxed">
              [Your Return Address]<br />
              [City, State, PIN Code]
            </p>

            <p className="text-gray-700 leading-relaxed mt-3">
              We recommend using a trackable shipping method. Strevo Store is not responsible for lost return packages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Refund Processing</h2>
            
            <h3 className="text-xl font-medium mb-3 mt-6">Timeline</h3>
            <p className="text-gray-700 leading-relaxed">
              Once we receive and inspect your return, refunds are processed within 5-7 business days.
            </p>

            <h3 className="text-xl font-medium mb-3 mt-6">Refund Method</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Refunds are issued to the original payment method</li>
              <li>Bank processing may take an additional 3-5 business days</li>
              <li>You will receive an email confirmation once the refund is processed</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 mt-6">Example Timeline</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Day 1: You ship the return</li>
              <li>Day 3-5: We receive and inspect the item</li>
              <li>Day 6-7: Refund is processed</li>
              <li>Day 10-12: Refund appears in your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Store Credit Option</h2>
            <p className="text-gray-700 leading-relaxed">
              Choose store credit for faster processing and receive an additional 10% bonus credit for future purchases.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Store credit never expires and can be used on any product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Restocking Fee</h2>
            <p className="text-gray-700 leading-relaxed">
              A 15% restocking fee may apply to returns without original packaging or missing tags.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How to Initiate a Return</h2>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Email returns@strevostore.com with:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Order number</li>
                  <li>Item(s) you wish to return</li>
                  <li>Reason for return</li>
                </ul>
              </li>
              <li>Pack the item securely with all original materials</li>
              <li>Ship to our return address</li>
              <li>Keep your tracking number for reference</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Refund Exceptions</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Refunds may be denied if:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Items are returned after 7 days</li>
              <li>Products show signs of wear or damage</li>
              <li>Tags have been removed</li>
              <li>Items are not in original packaging</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Final Sale Items</h2>
            <p className="text-gray-700 leading-relaxed">
              Items marked as "Final Sale" cannot be returned or exchanged. All sales are final.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-2">For return inquiries:</p>
            <p className="text-gray-700">Email: returns@strevostore.com</p>
            <p className="text-gray-700">Response time: Within 24 hours</p>
          </section>
        </div>
      </div>
    </div>
  )
}
