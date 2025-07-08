"use client"

import { Truck, Package, Clock, Shield, MapPin, Phone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ServicesPage() {
  const services = [
    {
      icon: <Truck className="h-8 w-8 text-red-600" />,
      title: "Express Delivery",
      description: "Same day and next day delivery for urgent shipments",
      features: ["Same day delivery", "Real-time tracking", "Priority handling"],
      price: "Starting from ₹200"
    },
    {
      icon: <Package className="h-8 w-8 text-red-600" />,
      title: "Standard Shipping",
      description: "Cost-effective solution for regular deliveries",
      features: ["3-5 business days", "Secure packaging", "Insurance included"],
      price: "Starting from ₹50"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Fragile Handling",
      description: "Special care for delicate and valuable items",
      features: ["Extra padding", "Careful handling", "Photo proof"],
      price: "Starting from ₹150"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive logistics solutions tailored to meet your shipping needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-lg font-semibold text-red-600 mb-4">
                  {service.price}
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Get Quote
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Prince Enterprises?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping</p>
            </div>
            <div className="text-center">
              <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Wide Coverage</h3>
              <p className="text-gray-600">Pan-India delivery network</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure Handling</h3>
              <p className="text-gray-600">Safe and secure packaging</p>
            </div>
            <div className="text-center">
              <Phone className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
