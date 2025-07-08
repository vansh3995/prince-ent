"use client"

import { useState } from 'react'
import { Calculator, Truck, Package, MapPin, Phone, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fromCity: '',
    toCity: '',
    weight: '',
    dimensions: '',
    serviceType: 'standard',
    packageType: 'document'
  })
  const [quote, setQuote] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const calculateQuote = () => {
    setLoading(true)
    
    // Simple calculation logic
    setTimeout(() => {
      const baseRate = 50
      const weightMultiplier = parseFloat(formData.weight) || 1
      const serviceMultiplier = formData.serviceType === 'express' ? 1.5 : 1
      const packageMultiplier = formData.packageType === 'fragile' ? 1.3 : 1
      
      const calculatedQuote = Math.round(baseRate * weightMultiplier * serviceMultiplier * packageMultiplier)
      setQuote(calculatedQuote)
      setLoading(false)
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateQuote()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Get Instant Quote</h1>
          <p className="text-gray-600">Calculate shipping costs for your packages</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quote Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Quote Calculator</span>
              </CardTitle>
              <CardDescription>
                Fill in the details to get an instant shipping quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                {/* Shipping Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From City
                    </label>
                    <input
                      type="text"
                      name="fromCity"
                      value={formData.fromCity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To City
                    </label>
                    <input
                      type="text"
                      name="toCity"
                      value={formData.toCity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Delhi"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="2.5"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dimensions (cm)
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="30x20x10"
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value="standard"
                        checked={formData.serviceType === 'standard'}
                        onChange={handleInputChange}
                        className="text-red-600"
                      />
                      <span>Standard (3-5 days)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="serviceType"
                        value="express"
                        checked={formData.serviceType === 'express'}
                        onChange={handleInputChange}
                        className="text-red-600"
                      />
                      <span>Express (1-2 days)</span>
                    </label>
                  </div>
                </div>

                {/* Package Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Type
                  </label>
                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="document">Documents</option>
                    <option value="parcel">General Parcel</option>
                    <option value="fragile">Fragile Items</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Calculating...' : 'Get Quote'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quote Result */}
          <div className="space-y-6">
            {quote !== null && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Your Quote</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">
                      ₹{quote}
                    </div>
                    <p className="text-gray-600 mb-4">
                      Estimated shipping cost for {formData.weight}kg from {formData.fromCity} to {formData.toCity}
                    </p>
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Book This Shipment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Features */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Prince Enterprises?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-red-600" />
                    <span>Fast & Reliable Delivery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <span>Real-time Tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-red-600" />
                    <span>24/7 Customer Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-red-600" />
                    <span>Secure Packaging</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-red-600" />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-red-600" />
                    <span>support@princeenterprises.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
