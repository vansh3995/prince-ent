import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/auth-context'
import { AdminAuthProvider } from '@/context/admin-auth-context'
import Navbar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prince Enterprises - Logistics & Transportation',
  description: 'Professional logistics and transportation services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdminAuthProvider>
            <Navbar />
            {children}
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
