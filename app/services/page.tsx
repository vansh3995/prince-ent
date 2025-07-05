import { Truck, Package, Clock, Shield, MapPin, Warehouse } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Truck,
      title: "Freight Transportation",
      description: "Reliable freight transportation services across India with real-time tracking.",
      features: ["Pan-India Coverage", "Real-time Tracking", "Insured Cargo", "24/7 Support"],
    },
    {
      icon: Package,
      title: "Express Delivery",
      description: "Fast and secure express delivery services for urgent shipments.",
      features: ["Same-day Delivery", "Express Handling", "Priority Support", "SMS Updates"],
    },
    {
      icon: Warehouse,
      title: "Warehousing Solutions",
      description: "Modern warehousing facilities with advanced inventory management.",
      features: ["Climate Controlled", "Security Systems", "Inventory Management", "Easy Access"],
    },
    {
      icon: Shield,
      title: "Insured Transport",
      description: "Complete insurance coverage for your valuable shipments.",
      features: ["Full Coverage", "Quick Claims", "Risk Assessment", "Premium Protection"],
    },
    {
      icon: Clock,
      title: "Scheduled Delivery",
      description: "Flexible delivery schedules to meet your business requirements.",
      features: ["Time Slots", "Advance Booking", "Recurring Deliveries", "Flexible Timing"],
    },
    {
      icon: MapPin,
      title: "Last Mile Delivery",
      description: "Efficient last-mile delivery solutions for e-commerce and retail.",
      features: ["Door-to-Door", "Proof of Delivery", "Customer Notifications", "Return Handling"],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive logistics and transportation solutions designed to meet all your business needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-6">Contact us today for a customized logistics solution</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Contact Us
            </Button>
          </Link>
          <Link href="/booking">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
