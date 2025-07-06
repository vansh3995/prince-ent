import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import { AuthProvider } from '@/context/auth-context'
import { AdminAuthProvider } from '@/context/admin-auth-context'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Prince Enterprises - Logistics & Transportation',
  description: 'Professional logistics and transportation services across India',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AdminAuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>{children}</main>
              <Toaster position="top-right" />
            </div>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
