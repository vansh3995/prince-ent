"use client"

import { useState } from 'react'
import { Package, MapPin, User, Calendar, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BookingPage() {
  const [formData, setFormData] = useState({
    // Sender Information
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: '',
    senderState: '',
    senderPincode: '',
    
    // Receiver Information
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    receiverAddress: '',
    receiverCity: '',
    receiverState: '',
    receiverPincode: '',
    
    // Package Information
    serviceType: 'standard',
    packageType: 'document',
    weight: '',
    length: '',
    width: '',
    height: '',
    declaredValue: '',
    description: '',
    
    // Pickup/Delivery
    pickupDate: '',
    deliveryType: 'standard'
  })

  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Booking request submitted successfully! We will contact you shortly with the AWB number.')
      
      // Reset form
      setFormData({
        senderName: '', senderPhone: '', senderEmail: '', senderAddress: '', senderCity: '', senderState: '', senderPincode: '',
        receiverName: '', receiverPhone: '', receiverEmail: '', receiverAddress: '', receiverCity: '', receiverState: '', receiverPincode: '',
        serviceType: 'standard', packageType: 'document', weight: '', length: '', width: '', height: '', declaredValue: '', description: '',
        pickupDate: '', deliveryType: 'standard'
      })
    } catch (error) {
      alert('Error submitting booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Shipment</h1>
          <p className="text-gray-600 text-lg">Complete the form below to schedule your pickup and delivery</p>
        </div>

        <Card className="max-w-6xl mx-auto">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="flex items-center text-2xl">
              <Package className="mr-3 h-6 w-6" />
              Shipment Booking Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Service Type Selection */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">Service Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-100">
                    <input
                      type="radio"
                      name="serviceType"
                      value="express"
                      checked={formData.serviceType === 'express'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Express Delivery</div>
                      <div className="text-sm text-gray-600">1-2 Business Days</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-100">
                    <input
                      type="radio"
                      name="serviceType"
                      value="standard"
                      checked={formData.serviceType === 'standard'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Standard Delivery</div>
                      <div className="text-sm text-gray-600">3-5 Business Days</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-100">
                    <input
                      type="radio"
                      name="serviceType"
                      value="economy"
                      checked={formData.serviceType === 'economy'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Economy Delivery</div>
                      <div className="text-sm text-gray-600">5-7 Business Days</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sender Information */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-green-800">
                  <User className="mr-2 h-5 w-5" />
                  Sender Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    name="senderName"
                    placeholder="Full Name *"
                    value={formData.senderName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="senderPhone"
                    placeholder="Phone Number *"
                    value={formData.senderPhone}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="senderEmail"
                    type="email"
                    placeholder="Email Address"
                    value={formData.senderEmail}
                    onChange={handleInputChange}
                  />
                  <div className="md:col-span-2 lg:col-span-3">
                    <Input
                      name="senderAddress"
                      placeholder="Complete Address *"
                      value={formData.senderAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Input
                    name="senderCity"
                    placeholder="City *"
                    value={formData.senderCity}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="senderState"
                    placeholder="State *"
                    value={formData.senderState}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="senderPincode"
                    placeholder="Pincode *"
                    value={formData.senderPincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Receiver Information */}
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-purple-800">
                  <MapPin className="mr-2 h-5 w-5" />
                  Receiver Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    name="receiverName"
                    placeholder="Full Name *"
                    value={formData.receiverName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="receiverPhone"
                    placeholder="Phone Number *"
                    value={formData.receiverPhone}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="receiverEmail"
                    type="email"
                    placeholder="Email Address"
                    value={formData.receiverEmail}
                    onChange={handleInputChange}
                  />
                  <div className="md:col-span-2 lg:col-span-3">
                    <Input
                      name="receiverAddress"
                      placeholder="Complete Address *"
                      value={formData.receiverAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Input
                    name="receiverCity"
                    placeholder="City *"
                    value={formData.receiverCity}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="receiverState"
                    placeholder="State *"
                    value={formData.receiverState}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="receiverPincode"
                    placeholder="Pincode *"
                    value={formData.receiverPincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Package Information */}
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-orange-800">
                  <Package className="mr-2 h-5 w-5" />
                  Package Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="packageType" className="block text-sm font-medium mb-2">Package Type *</label>
                    <select
                      id="packageType"
                      name="packageType"
                      value={formData.packageType}
                      onChange={handleInputChange}
                      required
                      aria-label="Select package type"
                      title="Choose the type of package you want to send"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="document">Document</option>
                      <option value="parcel">Parcel</option>
                      <option value="fragile">Fragile Item</option>
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="food">Food Items</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <Input
                    name="weight"
                    type="number"
                    step="0.1"
                    placeholder="Weight (kg) *"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input
                    name="length"
                    type="number"
                    placeholder="Length (cm)"
                    value={formData.length}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="width"
                    type="number"
                    placeholder="Width (cm)"
                    value={formData.width}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="height"
                    type="number"
                    placeholder="Height (cm)"
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="declaredValue"
                    type="number"
                    placeholder="Declared Value (₹)"
                    value={formData.declaredValue}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="pickupDate"
                    type="date"
                    placeholder="Preferred Pickup Date"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="mt-4">
                  <textarea
                    name="description"
                    placeholder="Package Description *"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    aria-label="Package description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6 border-t">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-12 py-3 text-lg font-semibold"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-5 w-5" />
                      Submit Booking Request
                    </>
                  )}
                </Button>
                
                <p className="text-sm text-gray-600 mt-4">
                  * Required fields. You will receive an AWB number and tracking details via SMS/Email.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
