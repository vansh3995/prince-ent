import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Prince Enterprises",
  description: "Terms of Service for Prince Enterprises",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
              <p>By using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Service Description</h2>
              <p>Prince Enterprises provides logistics and transportation services including package delivery, freight services, and related logistics solutions.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
              <p>You are responsible for providing accurate information and ensuring that your use of our services complies with all applicable laws.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <p>For questions about these Terms of Service, contact us at legal@princeenterprises.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}