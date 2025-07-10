import Link from "next/link"
import { Truck, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold">Prince Enterprises</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted logistics partner delivering excellence across the nation with reliable,
              fast, and secure transportation services.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-gray-400 hover:text-white transition-colors">
                  Track Package
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-400 hover:text-white transition-colors">
                  Book Shipment
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-gray-400 hover:text-white transition-colors">
                  Get Quote
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#express" className="text-gray-400 hover:text-white transition-colors">
                  Express Delivery
                </Link>
              </li>
              <li>
                <Link href="/services#freight" className="text-gray-400 hover:text-white transition-colors">
                  Freight Services
                </Link>
              </li>
              <li>
                <Link href="/services#network" className="text-gray-400 hover:text-white transition-colors">
                  Nationwide Network
                </Link>
              </li>
              <li>
                <Link href="/services#tracking" className="text-gray-400 hover:text-white transition-colors">
                  Real-time Tracking
                </Link>
              </li>
              <li>
                <Link href="/services#documentation" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/services#support" className="text-gray-400 hover:text-white transition-colors">
                  24/7 Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-600 mt-1" />
                <div className="text-gray-400">
                  <p>123 Business Park</p>
                  <p>Sector 18, Noida</p>
                  <p>Uttar Pradesh - 201301</p>
                  <p>India</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-600" />
                <div className="text-gray-400">
                  <p>+91 9876543210</p>
                  <p>+91 9876543211</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-600" />
                <div className="text-gray-400">
                  <p>info@princeenterprises.com</p>
                  <p>support@princeenterprises.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Prince Enterprises. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-gray-400 hover:text-white transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
