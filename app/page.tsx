import Link from "next/link"
import { Package, Truck, MapPin, Search, Calendar, FileText, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TrackingForm from "@/components/tracking-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">WELCOME TO PRINCE ENTERPRISES</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">Your Trusted Partner in Logistics & Transportation</p>
            <p className="text-lg mb-12 text-blue-200 max-w-2xl">
              Delivering excellence across the nation with reliable, fast, and secure transportation services.
              Experience seamless logistics solutions tailored for your business needs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/track">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg w-full sm:w-auto">
                  <Package className="mr-2 h-5 w-5" />
                  TRACK YOUR SHIPMENT
                </Button>
              </Link>
              <Link href="/booking">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg w-full sm:w-auto text-black"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  E-BOOKING
                </Button>
              </Link>
              <Link href="/quote">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg w-full sm:w-auto text-black"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  REQUEST A QUOTE
                </Button>
              </Link>
            </div>

            {/* Quick Track */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-3">Quick Track</h3>
              <TrackingForm minimal />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">OUR SERVICES</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive logistics solutions designed to meet all your transportation and delivery needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/services#express">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Express Delivery</CardTitle>
                  <CardDescription>
                    Fast and reliable same-day and next-day delivery services across major cities
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/services#freight">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Freight Transport</CardTitle>
                  <CardDescription>
                    Heavy cargo and bulk transportation with specialized vehicles and handling
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/services#network">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Nationwide Network</CardTitle>
                  <CardDescription>
                    Extensive delivery network covering all major cities and remote locations
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/services#tracking">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Real-time Tracking</CardTitle>
                  <CardDescription>
                    Advanced tracking system with live updates and delivery notifications
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/services#documentation">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Complete documentation support including customs clearance and paperwork
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/services#support">
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>24/7 Support</CardTitle>
                  <CardDescription>
                    Round-the-clock customer support for all your logistics queries and concerns
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-10">
            <Link href="/services">
              <Button className="bg-red-600 hover:bg-red-700">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-red-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-red-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-red-100">On-time Delivery</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-red-100">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
