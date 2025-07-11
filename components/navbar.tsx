"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Truck, User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">Prince Enterprises</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              About
            </Link>
            <Link
              href="/track"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/track') 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Track
            </Link>
            <Link
              href="/booking"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/booking') 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Booking
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-red-600 border-b-2 border-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Register
                  </Button>
                </Link>
                <Link href="/admin/login">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/"
              className={`block px-3 py-2 text-base font-medium transition-colors ${
                isActive('/') 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`block px-3 py-2 text-base font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/track"
              className={`block px-3 py-2 text-base font-medium transition-colors ${
                isActive('/track') 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Track
            </Link>
            <Link
              href="/booking"
              className={`block px-3 py-2 text-base font-medium transition-colors ${
                isActive('/booking') 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Booking
            </Link>
            <Link
              href="/contact"
              className={`block px-3 py-2 text-base font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-red-600 bg-red-50' 
                  : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            
            {/* Mobile Auth Section */}
            <div className="border-t pt-4">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                  <Link
                    href="/admin/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
