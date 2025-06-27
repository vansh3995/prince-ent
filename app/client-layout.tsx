"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { AdminAuthProvider } from "@/context/admin-auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <SessionProvider>
          <AdminAuthProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AdminAuthProvider>
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
