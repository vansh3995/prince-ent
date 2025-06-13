import { Package, Truck, Search, FileText, Phone, Warehouse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-blue-100 mb-8">
              Comprehensive logistics solutions tailored to meet your transportation needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">Comprehensive Logistics Solutions</h2>
            <p className="text-gray-600">
              At Prince Enterprises, we offer a wide range of logistics and transportation services designed to meet the
              diverse needs of our customers. From express delivery to heavy freight transport, we have the expertise
              and infrastructure to handle it all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow" id="express">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Express Delivery</CardTitle>
                <CardDescription>Fast and reliable same-day and next-day delivery services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Same-day delivery within city limits</li>
                  <li>• Next-day delivery to major cities</li>
                  <li>• Priority handling and expedited processing</li>
                  <li>• Real-time tracking and delivery updates</li>
                  <li>• Proof of delivery with electronic signature</li>
                </ul>
                <div className="mt-6">
                  <Link href="/quote">
                    <Button className="bg-red-600 hover:bg-red-700 w-full">Get a Quote</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" id="freight">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Freight Transport</CardTitle>
                <CardDescription>Heavy cargo and bulk transportation with specialized vehicles</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Full truckload (FTL) services</li>
                  <li>• Less than truckload (LTL) options</li>
                  <li>• Temperature-controlled transportation</li>
                  <li>• Oversized and heavy cargo handling</li>
                  <li>• Nationwide coverage with dedicated fleet</li>
                </ul>
                <div className="mt-6">
                  <Link href="/quote">
                    <Button className="bg-red-600 hover:bg-red-700 w-full">Get a Quote</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" id="warehousing">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Warehouse className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Warehousing</CardTitle>
                <CardDescription>Secure storage solutions with inventory management</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Short and long-term storage options</li>
                  <li>• Climate-controlled facilities</li>
                  <li>• Inventory management system</li>
                  <li>• Order fulfillment services</li>
                  <li>• 24/7 security and monitoring</li>
                </ul>
                <div className="mt-6">
                  <Link href="/quote">
                    <Button className="bg-red-600 hover:bg-red-700 w-full">Get a Quote</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" id="tracking">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>Advanced tracking system with live updates and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Live shipment tracking</li>
                  <li>• SMS and email notifications</li>
                  <li>• Delivery status updates</li>
                  <li>• Electronic proof of delivery</li>
                  <li>• Shipment history and reporting</li>
                </ul>
                <div className="mt-6">
                  <Link href="/track">
                    <Button className="bg-red-600 hover:bg-red-700 w-full">Track Shipment</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" id="documentation">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Complete documentation support for all shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Customs clearance documentation</li>
                  <li>• Commercial invoices preparation</li>
                  <li>• Bill of lading and airway bills</li>
                  <li>• Insurance certificates</li>
                  <li>• Digital document management</li>
                </ul>
                <div className="mt-6">
                  <Link href="/contact">
                    <Button className="bg-red-600 hover:bg-red-700 w-full">Learn More</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" id="support">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>Round-the-clock customer support for all your logistics needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• 24/7 customer service</li>
                  <li>• Dedicated account managers</li>
                  <li>• Multi-channel support (phone, email, chat)</li>
                  <li>• Query resolution and issue tracking</li>
                  <li>• Regular service updates</li>
                </ul>
                <div className="mt-6">
                  <Link href="/contact">
                    <Button className="bg-red-600 hover:bg-red-700 w-full">Contact Support</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">Industry-Specific Solutions</h2>
            <p className="text-gray-600">
              We understand that different industries have unique logistics requirements. Our specialized solutions are
              designed to address the specific needs of various sectors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-3">E-Commerce</h3>
              <p className="text-gray-600 mb-4">
                Tailored logistics solutions for online retailers, including order fulfillment, last-mile delivery, and
                returns management.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-3">Retail</h3>
              <p className="text-gray-600 mb-4">
                Store replenishment, inventory management, and distribution center operations for retail businesses.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-3">Manufacturing</h3>
              <p className="text-gray-600 mb-4">
                Raw material delivery, finished goods distribution, and just-in-time logistics for manufacturing
                companies.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-3">Healthcare</h3>
              <p className="text-gray-600 mb-4">
                Temperature-controlled transportation and specialized handling for medical supplies and pharmaceuticals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-3">FMCG</h3>
              <p className="text-gray-600 mb-4">
                Fast and efficient distribution networks for fast-moving consumer goods with time-sensitive delivery
                requirements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold mb-3">Automotive</h3>
              <p className="text-gray-600 mb-4">
                Specialized handling and transportation for automotive parts and components with strict delivery
                schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your logistics requirements and discover how Prince Enterprises can help
            streamline your transportation needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" variant="outline" className="border-white hover:bg-white hover:text-red-600">
                Request a Quote
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                Book a Shipment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
