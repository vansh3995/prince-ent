import Link from "next/link"
import { Truck, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="h-6 w-6 text-red-600" />
              <span className="text-lg font-bold">PRINCE ENTERPRISES</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner in logistics and transportation services across the nation.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/services#express" className="hover:text-white">
                  Express Delivery
                </Link>
              </li>
              <li>
                <Link href="/services#freight" className="hover:text-white">
                  Freight Transport
                </Link>
              </li>
              <li>
                <Link href="/services#warehousing" className="hover:text-white">
                  Warehousing
                </Link>
              </li>
              <li>
                <Link href="/services#supply-chain" className="hover:text-white">
                  Supply Chain
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/track" className="hover:text-white">
                  Track Package
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white">
                  Book Shipment
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-white">
                  Rate Calculator
                </Link>
              </li>
              <li>
                <Link href="/network" className="hover:text-white">
                  Branch Locator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p>Prince Enterprises, Maur Mandi</p>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p>+91 93172 24000</p>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p>princejagga165@gmail.com</p>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p>Mon-Sat: 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Prince Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
