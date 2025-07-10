import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refund Policy - Prince Enterprises",
  description: "Refund Policy for Prince Enterprises",
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">Refund Eligibility</h2>
              <p>Refunds are available for prepaid shipments that are cancelled before pickup or in case of service failure on our part.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Refund Process</h2>
              <p>To request a refund, please contact our customer service team with your AWB number and reason for refund within 7 days of booking.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Processing Time</h2>
              <p>Approved refunds will be processed within 7-10 business days and credited back to the original payment method.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Non-Refundable Items</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Shipments that have been picked up</li>
                <li>COD (Cash on Delivery) charges</li>
                <li>Insurance charges for delivered items</li>
                <li>Service charges for successfully completed deliveries</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Partial Refunds</h2>
              <p>In case of partial service failure, a partial refund may be issued based on the extent of service provided.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact for Refunds</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-medium">For refund requests, contact:</p>
                <p>Email: refunds@princeenterprises.com</p>
                <p>Phone: +91 9876543210</p>
                <p>Customer Service Hours: 9:00 AM - 6:00 PM (Mon-Sat)</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Dispute Resolution</h2>
              <p>If you are not satisfied with our refund decision, you may escalate the matter to our senior management team at escalation@princeenterprises.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}