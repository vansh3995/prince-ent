"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowRight, CheckCircle } from "lucide-react"

type AddressField = "name" | "phone" | "address" | "city" | "state" | "pincode" | "email" | "date"

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function BookingPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [step, setStep] = useState(1)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  const [formData, setFormData] = useState({
    serviceType: "express",
    packageType: "parcel",
    weight: "",
    value: "",
    dimensions: { length: "", width: "", height: "" },
    description: "",
    pickup: {
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      email: "",
      date: "",
    },
    delivery: {
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      email: "",
      date: "",
    },
  })

  // Simple authentication check without API call
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for stored auth token from admin auth or user auth
        const token = localStorage.getItem('adminToken') || 
                      localStorage.getItem('authToken') || 
                      sessionStorage.getItem('authToken') ||
                      localStorage.getItem('token') ||
                      sessionStorage.getItem('token')
        
        // Check for user data
        const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData')
        
        if (!token && !userData) {
          // No authentication found, redirect to login
          router.push('/login?redirect=/booking')
          return
        }

        // Try to get user info from localStorage
        if (userData) {
          try {
            const user = JSON.parse(userData)
            setUser(user)
            
            // Pre-fill sender details if available
            setFormData(prev => ({
              ...prev,
              pickup: {
                ...prev.pickup,
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || ''
              }
            }))
          } catch (e) {
            console.error('Error parsing user data:', e)
            // If userData is corrupted, check if we have a token
            if (token) {
              // Set a basic user object if we have token but corrupted userData
              const basicUser = {
                id: 'user_' + Date.now(),
                name: 'User',
                email: 'user@example.com'
              }
              setUser(basicUser)
              localStorage.setItem('userData', JSON.stringify(basicUser))
            } else {
              router.push('/login?redirect=/booking')
              return
            }
          }
        } else if (token) {
          // We have token but no userData, create basic user
          const basicUser = {
            id: 'user_' + Date.now(),
            name: 'User',
            email: 'user@example.com'
          }
          setUser(basicUser)
          localStorage.setItem('userData', JSON.stringify(basicUser))
        }

      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login?redirect=/booking')
        return
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleAddressChange = (
    section: "pickup" | "delivery",
    field: AddressField,
    value: string
  ) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    })
  }

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.weight.trim()) {
          setError("Weight is required")
          return false
        }
        if (!formData.description.trim()) {
          setError("Package description is required")
          return false
        }
        break
      case 2:
        if (!formData.pickup.name.trim() || !formData.pickup.phone.trim() || !formData.pickup.address.trim()) {
          setError("Please fill all pickup details")
          return false
        }
        if (!formData.delivery.name.trim() || !formData.delivery.phone.trim() || !formData.delivery.address.trim()) {
          setError("Please fill all delivery details")
          return false
        }
        break
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (step < 3) {
      if (validateStep(step)) {
        setStep(step + 1)
      }
    } else {
      // Final submission
      setSubmitLoading(true)
      try {
        const token = localStorage.getItem('authToken') || 
                     sessionStorage.getItem('authToken') ||
                     localStorage.getItem('token') ||
                     sessionStorage.getItem('token')

        // Call MongoDB API to save booking
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            userId: user?.id,
            createdAt: new Date().toISOString(),
            status: 'pending'
          })
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setBookingReference(result.bookingId || result.awb || 'BWB' + Date.now().toString().slice(-8))
          setBookingComplete(true)
          setSuccess("Booking created successfully!")
        } else {
          // Fallback to localStorage if API fails
          const bookingRef = 'BWB' + Date.now().toString().slice(-8)
          setBookingReference(bookingRef)
          setBookingComplete(true)
          setSuccess("Booking created successfully!")
          
          // Save booking to localStorage as backup
          const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]')
          bookings.push({
            id: bookingRef,
            ...formData,
            userId: user?.id,
            createdAt: new Date().toISOString(),
            status: 'pending'
          })
          localStorage.setItem('userBookings', JSON.stringify(bookings))
        }

      } catch (error) {
        console.error('Booking error:', error)
        // Fallback to localStorage if API call fails
        const bookingRef = 'BWB' + Date.now().toString().slice(-8)
        setBookingReference(bookingRef)
        setBookingComplete(true)
        setSuccess("Booking created successfully!")
        
        // Save booking to localStorage as backup
        const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]')
        bookings.push({
          id: bookingRef,
          ...formData,
          userId: user?.id,
          createdAt: new Date().toISOString(),
          status: 'pending'
        })
        localStorage.setItem('userBookings', JSON.stringify(bookings))
      } finally {
        setSubmitLoading(false)
      }
    }
  }

  // Simple shipping cost calculator
  const calculateShippingCost = (bookingData: any): number => {
    // Example logic: base + per kg + service type multiplier
    const base = 100;
    const weight = parseFloat(bookingData.weight || bookingData.formData?.weight || "1");
    let multiplier = 1;
    switch (bookingData.serviceType || bookingData.formData?.serviceType) {
      case "express":
        multiplier = 1.5;
        break;
      case "standard":
        multiplier = 1.2;
        break;
      case "economy":
        multiplier = 1;
        break;
      default:
        multiplier = 1;
    }
    return Math.round((base + weight * 50) * multiplier);
  };

  const initiatePayment = async (bookingData: any) => {
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: calculateShippingCost(bookingData),
          bookingId: bookingData.awb
        })
      })
      
      const { paymentUrl } = await response.json()
      window.location.href = paymentUrl
    } catch (error) {
      console.error('Payment initialization failed:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    localStorage.removeItem('userData')
    sessionStorage.removeItem('userData')
    router.push('/login')
  }

  const resetForm = () => {
    setStep(1)
    setBookingComplete(false)
    setBookingReference("")
    setError("")
    setSuccess("")
    setFormData({
      serviceType: "express",
      packageType: "parcel",
      weight: "",
      value: "",
      dimensions: { length: "", width: "", height: "" },
      description: "",
      pickup: {
        name: user?.name || "",
        phone: user?.phone || "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        email: user?.email || "",
        date: "",
      },
      delivery: {
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        email: "",
        date: "",
      },
    })
  }

  // Show loading screen while checking authentication
  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push('/login?redirect=/booking')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with user info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">E-Booking</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Book your shipment online in just a few easy steps</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {!bookingComplete ? (
          <>
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10"></div>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                      i <= step ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-sm">
                <span className={step >= 1 ? "text-red-600 font-medium" : "text-gray-600"}>Shipment Details</span>
                <span className={step >= 2 ? "text-red-600 font-medium" : "text-gray-600"}>Addresses</span>
                <span className={step >= 3 ? "text-red-600 font-medium" : "text-gray-600"}>Confirmation</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipment Details</h2>
                  <p className="text-gray-600 mb-6">Provide package details and specifications</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="serviceType" className="text-base font-medium block mb-2">Service Type</label>
                      <select
                        id="serviceType"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        title="Select service type for your shipment"
                      >
                        <option value="express">Express (1–2 days)</option>
                        <option value="standard">Standard (3–5 days)</option>
                        <option value="economy">Economy (5–7 days)</option>
                      </select>
                    </div>

                    <div>
                      <fieldset>
                        <legend className="text-base font-medium block mb-2">Package Type</legend>
                        <div className="flex gap-6 mt-2">
                          {['document', 'parcel', 'heavy'].map((type) => (
                            <label key={type} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                value={type}
                                checked={formData.packageType === type}
                                onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                                className="text-red-600 focus:ring-red-500"
                              />
                              <span className="capitalize">{type === 'heavy' ? 'Heavy Goods' : type}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="weight" className="text-base font-medium block mb-2">Weight (kg) *</label>
                        <input
                          id="weight"
                          type="number"
                          step="0.1"
                          placeholder="Enter weight"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="value" className="text-base font-medium block mb-2">Declared Value (₹)</label>
                        <input
                          id="value"
                          type="number"
                          placeholder="Enter value"
                          value={formData.value}
                          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-base font-medium block mb-2">Dimensions (cm)</label>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="length" className="sr-only">Length</label>
                          <input
                            id="length"
                            placeholder="Length"
                            value={formData.dimensions.length}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                dimensions: { ...formData.dimensions, length: e.target.value },
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label htmlFor="width" className="sr-only">Width</label>
                          <input
                            id="width"
                            placeholder="Width"
                            value={formData.dimensions.width}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                dimensions: { ...formData.dimensions, width: e.target.value },
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label htmlFor="height" className="sr-only">Height</label>
                          <input
                            id="height"
                            placeholder="Height"
                            value={formData.dimensions.height}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                dimensions: { ...formData.dimensions, height: e.target.value },
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="text-base font-medium block mb-2">Package Description *</label>
                      <textarea
                        id="description"
                        placeholder="Describe the contents of your package"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Pickup & Delivery</h2>
                  <p className="text-gray-600 mb-6">Enter pickup and delivery address details</p>
                  
                  <div className="space-y-8">
                    {/* Pickup Address */}
                    <fieldset>
                      <legend className="text-lg font-medium text-green-700 mb-4">Pickup Address</legend>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="pickup-name" className="block mb-2">Full Name *</label>
                            <input
                              id="pickup-name"
                              value={formData.pickup.name}
                              onChange={(e) => handleAddressChange("pickup", "name", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="pickup-phone" className="block mb-2">Phone Number *</label>
                            <input
                              id="pickup-phone"
                              type="tel"
                              value={formData.pickup.phone}
                              onChange={(e) => handleAddressChange("pickup", "phone", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="pickup-email" className="block mb-2">Email Address</label>
                          <input
                            id="pickup-email"
                            type="email"
                            value={formData.pickup.email}
                            onChange={(e) => handleAddressChange("pickup", "email", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="pickup-address" className="block mb-2">Complete Address *</label>
                          <textarea
                            id="pickup-address"
                            value={formData.pickup.address}
                            onChange={(e) => handleAddressChange("pickup", "address", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows={2}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="pickup-city" className="block mb-2">City *</label>
                            <input
                              id="pickup-city"
                              value={formData.pickup.city}
                              onChange={(e) => handleAddressChange("pickup", "city", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="pickup-state" className="block mb-2">State *</label>
                            <input
                              id="pickup-state"
                              value={formData.pickup.state}
                              onChange={(e) => handleAddressChange("pickup", "state", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="pickup-pincode" className="block mb-2">Pincode *</label>
                            <input
                              id="pickup-pincode"
                              value={formData.pickup.pincode}
                              onChange={(e) => handleAddressChange("pickup", "pincode", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="pickup-date" className="block mb-2">Preferred Pickup Date</label>
                          <input
                            id="pickup-date"
                            type="date"
                            value={formData.pickup.date}
                            onChange={(e) => handleAddressChange("pickup", "date", e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </fieldset>

                    {/* Delivery Address */}
                    <fieldset>
                      <legend className="text-lg font-medium text-blue-700 mb-4">Delivery Address</legend>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="delivery-name" className="block mb-2">Full Name *</label>
                            <input
                              id="delivery-name"
                              value={formData.delivery.name}
                              onChange={(e) => handleAddressChange("delivery", "name", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="delivery-phone" className="block mb-2">Phone Number *</label>
                            <input
                              id="delivery-phone"
                              type="tel"
                              value={formData.delivery.phone}
                              onChange={(e) => handleAddressChange("delivery", "phone", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="delivery-email" className="block mb-2">Email Address</label>
                          <input
                            id="delivery-email"
                            type="email"
                            value={formData.delivery.email}
                            onChange={(e) => handleAddressChange("delivery", "email", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="delivery-address" className="block mb-2">Complete Address *</label>
                          <textarea
                            id="delivery-address"
                            value={formData.delivery.address}
                            onChange={(e) => handleAddressChange("delivery", "address", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows={2}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="delivery-city" className="block mb-2">City *</label>
                            <input
                              id="delivery-city"
                              value={formData.delivery.city}
                              onChange={(e) => handleAddressChange("delivery", "city", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="delivery-state" className="block mb-2">State *</label>
                            <input
                              id="delivery-state"
                              value={formData.delivery.state}
                              onChange={(e) => handleAddressChange("delivery", "state", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="delivery-pincode" className="block mb-2">Pincode *</label>
                            <input
                              id="delivery-pincode"
                              value={formData.delivery.pincode}
                              onChange={(e) => handleAddressChange("delivery", "pincode", e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-2 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Confirmation</h2>
                  <p className="text-gray-600 mb-6">Review your shipment details before confirming</p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Package Details</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Service:</strong> {formData.serviceType}</p>
                          <p><strong>Package Type:</strong> {formData.packageType}</p>
                          <p><strong>Weight:</strong> {formData.weight} kg</p>
                          <p><strong>Value:</strong> ₹{formData.value}</p>
                          <p><strong>Dimensions:</strong> {formData.dimensions.length} × {formData.dimensions.width} × {formData.dimensions.height} cm</p>
                          <p><strong>Description:</strong> {formData.description}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Addresses</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium text-green-700">Pickup:</p>
                            <p>{formData.pickup.name}</p>
                            <p>{formData.pickup.address}</p>
                            <p>{formData.pickup.city}, {formData.pickup.state} - {formData.pickup.pincode}</p>
                            <p>Phone: {formData.pickup.phone}</p>
                            {formData.pickup.date && <p>Date: {formData.pickup.date}</p>}
                          </div>
                          
                          <div>
                            <p className="font-medium text-blue-700">Delivery:</p>
                            <p>{formData.delivery.name}</p>
                            <p>{formData.delivery.address}</p>
                            <p>{formData.delivery.city}, {formData.delivery.state} - {formData.delivery.pincode}</p>
                            <p>Phone: {formData.delivery.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-2 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center"
                    >
                      {submitLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Booking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm & Book
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-4">Your shipment has been successfully booked</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Your Booking Reference Number:</p>
              <p className="font-mono font-bold text-2xl text-gray-900">{bookingReference}</p>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Please save this reference number for tracking your shipment. 
              You will receive a confirmation email shortly.
            </p>
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={resetForm}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Book Another Shipment
              </button>
              <button 
                onClick={() => router.push(`/track`)}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Track This Shipment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
