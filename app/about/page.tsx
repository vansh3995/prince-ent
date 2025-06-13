import { Truck, Award, Users, Globe, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Prince Enterprises</h1>
            <p className="text-xl text-blue-100 mb-8">
              Your trusted logistics partner with a commitment to excellence and reliability
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2010, Prince Enterprises has grown from a small local courier service to one of the most
                trusted logistics companies in the region. Our journey began with a simple mission: to provide reliable,
                efficient, and customer-focused transportation services.
              </p>
              <p className="text-gray-600 mb-4">
                Over the years, we have expanded our network, enhanced our technology, and built a team of dedicated
                professionals committed to delivering excellence in every shipment.
              </p>
              <p className="text-gray-600">
                Today, we serve thousands of customers across the nation, from individual senders to large corporations,
                handling everything from small parcels to heavy freight with the same level of care and attention to
                detail.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <Truck className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Extensive Fleet</h3>
                    <p className="text-gray-600">
                      Modern vehicles equipped with GPS tracking and temperature control capabilities
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Nationwide Network</h3>
                    <p className="text-gray-600">
                      Presence in over 50 cities with strategically located hubs and warehouses
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Expert Team</h3>
                    <p className="text-gray-600">
                      Skilled professionals with years of experience in logistics and transportation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Vision & Mission</h2>
            <p className="text-gray-600">
              We are driven by a clear vision and mission that guides everything we do at Prince Enterprises
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Our Vision</h3>
              <p className="text-gray-600 mb-4">
                To be the most trusted and preferred logistics partner known for reliability, innovation, and customer
                satisfaction across the nation.
              </p>
              <p className="text-gray-600">
                We envision a future where logistics is seamless, transparent, and accessible to businesses of all
                sizes, contributing to their growth and success.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h3 className="text-2xl font-bold mb-4 text-red-600">Our Mission</h3>
              <p className="text-gray-600 mb-4">
                To deliver exceptional logistics services through continuous innovation, operational excellence, and a
                customer-first approach.
              </p>
              <p className="text-gray-600">
                We are committed to building lasting relationships with our customers by understanding their unique
                needs and providing tailored solutions that exceed their expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Core Values</h2>
            <p className="text-gray-600">These principles guide our actions and decisions every day</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-red-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our operations, from customer service to delivery execution.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-gray-600">
                We conduct our business with honesty, transparency, and ethical practices at all times.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reliability</h3>
              <p className="text-gray-600">
                We deliver on our promises, ensuring timely and secure transportation of every shipment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Our Services?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Prince Enterprises for their logistics needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" variant="outline" className="border-white hover:bg-white hover:text-red-600">
                Request a Quote
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
