import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Prince Enterprises",
  description: "Privacy Policy for Prince Enterprises",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@princeenterprises.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}