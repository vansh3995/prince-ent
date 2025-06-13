"use client"

import { useState } from "react"
import { MapPin, Search, Phone, Mail, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for branches
const branches = [
  {
    id: 1,
    name: "Delhi Hub",
    address: "123 Transport Nagar, New Delhi, Delhi 110001",
    phone: "+91 11 2345 6789",
    email: "delhi@princeenterprises.com",
    type: "Hub",
    region: "North",
    services: ["Express", "Freight", "Warehousing"],
  },
  {
    id: 2,
    name: "Mumbai Central",
    address: "456 Logistics Park, Andheri East, Mumbai, Maharashtra 400069",
    phone: "+91 22 3456 7890",
    email: "mumbai@princeenterprises.com",
    type: "Hub",
    region: "West",
    services: ["Express", "Freight", "Warehousing"],
  },
  {
    id: 3,
    name: "Bangalore Office",
    address: "789 Tech Park, Whitefield, Bangalore, Karnataka 560066",
    phone: "+91 80 4567 8901",
    email: "bangalore@princeenterprises.com",
    type: "Branch",
    region: "South",
    services: ["Express", "Freight"],
  },
  {
    id: 4,
    name: "Kolkata Center",
    address: "101 Transport Lane, Salt Lake, Kolkata, West Bengal 700091",
    phone: "+91 33 5678 9012",
    email: "kolkata@princeenterprises.com",
    type: "Hub",
    region: "East",
    services: ["Express", "Freight", "Warehousing"],
  },
  {
    id: 5,
    name: "Chennai Branch",
    address: "202 Logistics Avenue, Guindy, Chennai, Tamil Nadu 600032",
    phone: "+91 44 6789 0123",
    email: "chennai@princeenterprises.com",
    type: "Branch",
    region: "South",
    services: ["Express", "Freight"],
  },
  {
    id: 6,
    name: "Hyderabad Office",
    address: "303 Cargo Complex, Gachibowli, Hyderabad, Telangana 500032",
    phone: "+91 40 7890 1234",
    email: "hyderabad@princeenterprises.com",
    type: "Branch",
    region: "South",
    services: ["Express"],
  },
  {
    id: 7,
    name: "Ahmedabad Center",
    address: "404 Transport Hub, Navrangpura, Ahmedabad, Gujarat 380009",
    phone: "+91 79 8901 2345",
    email: "ahmedabad@princeenterprises.com",
    type: "Branch",
    region: "West",
    services: ["Express", "Freight"],
  },
  {
    id: 8,
    name: "Pune Office",
    address: "505 Logistics Park, Hinjewadi, Pune, Maharashtra 411057",
    phone: "+91 20 9012 3456",
    email: "pune@princeenterprises.com",
    type: "Branch",
    region: "West",
    services: ["Express"],
  },
  {
    id: 9,
    name: "Jaipur Branch",
    address: "606 Transport Nagar, Malviya Nagar, Jaipur, Rajasthan 302017",
    phone: "+91 141 0123 4567",
    email: "jaipur@princeenterprises.com",
    type: "Branch",
    region: "North",
    services: ["Express"],
  },
]

export default function NetworkPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = regionFilter === "all" || branch.region === regionFilter
    const matchesType = typeFilter === "all" || branch.type === typeFilter

    return matchesSearch && matchesRegion && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Network</h1>
            <p className="text-xl text-blue-100 mb-8">
              Extensive coverage across the nation with strategically located hubs and branches
            </p>
          </div>
        </div>
      </section>

      {/* Network Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">Nationwide Presence</h2>
            <p className="text-gray-600">
              Prince Enterprises operates a vast network of hubs, branches, and service centers strategically located
              across the country to ensure efficient and timely delivery of your shipments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-red-50 border border-red-100 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">4</div>
              <div className="text-gray-600">Major Hubs</div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-gray-600">Service Points</div>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Delivery Personnel</div>
            </div>
          </div>

          <Tabs defaultValue="branches">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="branches">Branch Locator</TabsTrigger>
              <TabsTrigger value="coverage">Coverage Map</TabsTrigger>
            </TabsList>

            <TabsContent value="branches">
              <Card>
                <CardHeader>
                  <CardTitle>Find a Branch</CardTitle>
                  <CardDescription>Locate our branches and service centers across the country</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by city or location"
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="North">North</SelectItem>
                        <SelectItem value="South">South</SelectItem>
                        <SelectItem value="East">East</SelectItem>
                        <SelectItem value="West">West</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Hub">Hub</SelectItem>
                        <SelectItem value="Branch">Branch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {filteredBranches.length > 0 ? (
                      filteredBranches.map((branch) => (
                        <div key={branch.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{branch.name}</h3>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Building className="h-4 w-4 mr-1" />
                                <span>{branch.type}</span>
                                <span className="mx-2">•</span>
                                <span>{branch.region} Region</span>
                              </div>
                            </div>
                            <div className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded">
                              {branch.services.join(", ")}
                            </div>
                          </div>
                          <div className="mt-3 flex items-start space-x-1 text-gray-600">
                            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span>{branch.address}</span>
                          </div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{branch.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{branch.email}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No branches found matching your criteria. Please try a different search.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="coverage">
              <Card>
                <CardHeader>
                  <CardTitle>Coverage Map</CardTitle>
                  <CardDescription>Our service coverage across different regions of the country</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Coverage Map</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Our interactive coverage map is currently being updated. Please use the branch locator or
                        contact our customer service for specific coverage information.
                      </p>
                      <Button className="mt-4 bg-red-600 hover:bg-red-700">Check Serviceability</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Service Capabilities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Service Capabilities</h2>
            <p className="text-gray-600">
              With our extensive network, we offer comprehensive coverage and reliable service across the nation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Express Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metro to Metro</span>
                    <span className="font-semibold">24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metro to Tier 1</span>
                    <span className="font-semibold">24-48 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metro to Tier 2</span>
                    <span className="font-semibold">48-72 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remote Areas</span>
                    <span className="font-semibold">3-5 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Freight Transport</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">FTL Services</span>
                    <span className="font-semibold">All Major Routes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">LTL Services</span>
                    <span className="font-semibold">50+ Cities</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature Controlled</span>
                    <span className="font-semibold">Major Metros</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heavy Cargo</span>
                    <span className="font-semibold">Pan India</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Warehousing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Space</span>
                    <span className="font-semibold">500,000+ sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Locations</span>
                    <span className="font-semibold">4 Major Hubs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature Controlled</span>
                    <span className="font-semibold">Delhi, Mumbai</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Security</span>
                    <span className="font-semibold">24/7 Monitored</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need More Information?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact our team to learn more about our network capabilities and how we can serve your specific location
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="border-white hover:bg-white hover:text-red-600">
              Check Serviceability
            </Button>
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
