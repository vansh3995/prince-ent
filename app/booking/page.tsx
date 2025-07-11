"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, MapPin, Scale, Truck, Calendar, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import PaymentModal from '@/components/payment/PaymentModal'

interface FormData {
  from: string
  to: string
  packageType: string
  weight: string
  serviceType: string
  customerName: string
  customerEmail: string
  customerPhone: string
  pickupDate: string
  deliveryAddress: string
  pickupAddress: string
  packageValue: string
  specialInstructions: string
}

interface FormErrors {
  [key: string]: string
}

export default function BookingPage() {
  const { user, token, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    from: "",
    to: "",
    packageType: "",
    weight: "",
    serviceType: "standard",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    pickupDate: "",
    deliveryAddress: "",
    pickupAddress: "",
    packageValue: "",
    specialInstructions: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pendingBookingId, setPendingBookingId] = useState("")

  useEffect(() => {
    console.log(" Booking page - Auth state:", { 
      user: user?.email, 
      authLoading,
      hasToken: !!token
    })
    
    // Only redirect if loading is complete and user is not authenticated
    if (!authLoading && !user) {
      console.log(" Booking - Redirecting to login")
      router.push("/login?redirect=/booking")
      return
    }

    // Pre-fill user data if available
    if (user && !formData.customerName) {
      console.log(" Pre-filling user data:", user)
      setFormData(prev => ({
        ...prev,
        customerName: user.name || "",
        customerEmail: user.email || ""
      }))
    }
  }, [user, authLoading, token, router, formData.customerName])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required"
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email address"
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required"
    } else if (!/^\+?[\d\s\-()]{10,15}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = "Please enter a valid phone number"
    }

    if (!formData.from.trim()) {
      newErrors.from = "Origin city is required"
    }

    if (!formData.to.trim()) {
      newErrors.to = "Destination city is required"
    }

    if (!formData.packageType) {
      newErrors.packageType = "Package type is required"
    }

    if (!formData.weight.trim()) {
      newErrors.weight = "Weight is required"
    } else if (parseFloat(formData.weight) <= 0) {
      newErrors.weight = "Weight must be greater than 0"
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = "Pickup date is required"
    }

    if (!formData.pickupAddress.trim()) {
      newErrors.pickupAddress = "Pickup address is required"
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = "Delivery address is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateEstimatedCost = () => {
    if (!formData.weight || !formData.serviceType) return

    const weight = parseFloat(formData.weight)
    const baseCost = 50
    const weightCost = weight * 10
    const serviceMultiplier = formData.serviceType === "express" ? 1.5 : formData.serviceType === "overnight" ? 2 : 1
    
    const total = (baseCost + weightCost) * serviceMultiplier
    setEstimatedCost(Math.round(total))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (!token) {
      setErrors({ submit: "Please login to create booking" })
      router.push("/login?redirect=/booking")
      return
    }

    // Calculate cost first
    if (!estimatedCost) {
      calculateEstimatedCost()
      if (!estimatedCost) {
        setErrors({ submit: "Unable to calculate cost. Please check your inputs." })
        return
      }
    }

    setIsLoading(true)
    
    try {
      // Generate booking ID
      const bookingId = `BK${Date.now()}`
      setPendingBookingId(bookingId)
      
      // Create booking data
      const bookingData = {
        ...formData,
        id: bookingId,
        userId: user?.id,
        createdAt: new Date().toISOString(),
        status: "pending_payment",
        estimatedCost,
        paymentStatus: "pending"
      }
      
      // Store booking data temporarily
      localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData))
      
      console.log("Booking created, opening payment modal:", bookingData)
      
      // Show payment modal
      setShowPaymentModal(true)
      
    } catch (error: any) {
      console.error("Booking creation error:", error)
      setErrors({ submit: error.message || "Failed to create booking. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentData: any) => {
    console.log("Payment successful:", paymentData)
    
    // Update booking with payment info
    const bookingData = JSON.parse(localStorage.getItem(`booking_${pendingBookingId}`) || '{}')
    bookingData.paymentStatus = 'paid'
    bookingData.paymentId = paymentData.payment_id
    bookingData.orderId = paymentData.order_id
    bookingData.paidAt = new Date().toISOString()
    bookingData.status = 'confirmed'
    
    localStorage.setItem(`booking_${pendingBookingId}`, JSON.stringify(bookingData))
    
    // Redirect to success page
    router.push(`/booking/success?id=${pendingBookingId}`)
  }

  const handlePaymentClose = () => {
    setShowPaymentModal(false)
    // Clean up pending booking
    if (pendingBookingId) {
      localStorage.removeItem(`booking_${pendingBookingId}`)
      setPendingBookingId("")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
    
    // Recalculate cost when relevant fields change
    if (name === "weight" || name === "serviceType") {
      setTimeout(calculateEstimatedCost, 100)
    }
  }

  const InputField = ({ 
    label, 
    name, 
    type = "text", 
    required = false, 
    placeholder = "", 
    icon: Icon 
  }: {
    label: string
    name: keyof FormData
    type?: string
    required?: boolean
    placeholder?: string
    icon?: any
  }) => (
    <div className="space-y-2">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
      >
        {Icon && <Icon className="inline w-4 h-4 mr-2" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <p id={`${name}-error`} className="text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  )

  const SelectField = ({ 
    label, 
    name, 
    options, 
    required = false, 
    icon: Icon 
  }: {
    label: string
    name: keyof FormData
    options: { value: string; label: string }[]
    required?: boolean
    icon?: any
  }) => (
    <div className="space-y-2">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
      >
        {Icon && <Icon className="inline w-4 h-4 mr-2" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p id={`${name}-error`} className="text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  )

  // Add loading state for auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Shipment</h1>
          <p className="text-gray-600">
            Fill out the form below to book your shipment with Prince Enterprises
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Customer Information</span>
              </CardTitle>
              <CardDescription>
                Please provide your contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="customerName"
                  required
                  placeholder="John Doe"
                />
                <InputField
                  label="Email Address"
                  name="customerEmail"
                  type="email"
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Phone Number"
                  name="customerPhone"
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                />
                <InputField
                  label="Pickup Date"
                  name="pickupDate"
                  type="date"
                  required
                  icon={Calendar}
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Shipment Details</span>
              </CardTitle>
              <CardDescription>
                Provide details about your shipment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="From City"
                  name="from"
                  required
                  placeholder="Mumbai"
                  icon={MapPin}
                />
                <InputField
                  label="To City"
                  name="to"
                  required
                  placeholder="Delhi"
                  icon={MapPin}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Package Type"
                  name="packageType"
                  required
                  icon={Package}
                  options={[
                    { value: "document", label: "Document" },
                    { value: "package", label: "Package" },
                    { value: "fragile", label: "Fragile Item" },
                    { value: "electronics", label: "Electronics" },
                    { value: "clothing", label: "Clothing" },
                    { value: "food", label: "Food Items" }
                  ]}
                />
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <InputField
                      label="Weight (kg)"
                      name="weight"
                      type="number"
                      required
                      placeholder="0.5"
                      icon={Scale}
                    />
                  </div>
                  <div className="flex-1">
                    <InputField
                      label="Package Value (₹)"
                      name="packageValue"
                      type="number"
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>

              <SelectField
                label="Service Type"
                name="serviceType"
                required
                icon={Truck}
                options={[
                  { value: "standard", label: "Standard (3-5 days)" },
                  { value: "express", label: "Express (1-2 days)" },
                  { value: "overnight", label: "Overnight (Next day)" }
                ]}
              />
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle>Pickup & Delivery Addresses</CardTitle>
              <CardDescription>
                Provide complete addresses for pickup and delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700">
                    Pickup Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="pickupAddress"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    required
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.pickupAddress ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter complete pickup address"
                    aria-describedby={errors.pickupAddress ? "pickupAddress-error" : undefined}
                  />
                  {errors.pickupAddress && (
                    <p id="pickupAddress-error" className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.pickupAddress}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    required
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.deliveryAddress ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter complete delivery address"
                    aria-describedby={errors.deliveryAddress ? "deliveryAddress-error" : undefined}
                  />
                  {errors.deliveryAddress && (
                    <p id="deliveryAddress-error" className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.deliveryAddress}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
                  Special Instructions
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special handling instructions (optional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cost Estimate */}
          {estimatedCost && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Estimated Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₹{estimatedCost.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  *This is an estimated cost. Final cost may vary based on actual weight and dimensions.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.submit}
                  </p>
                </div>
              )}
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing Booking...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Book Shipment</span>
                  </div>
                )}
              </Button>
              
              <p className="text-sm text-gray-600 text-center mt-4">
                By clicking "Book Shipment", you agree to our terms and conditions.
              </p>
            </CardContent>
          </Card>
        </form>

        {showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={handlePaymentClose}
            onSuccess={handlePaymentSuccess}
            amount={estimatedCost || 0}
            bookingId={pendingBookingId}
            customerInfo={{
              name: formData.customerName,
              email: formData.customerEmail,
              phone: formData.customerPhone
            }}
          />
        )}
      </div>
    </div>
  )
}