"use client"

import type React from "react"
import axios from "axios"
import { useState } from "react"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AddressField = "name" | "phone" | "address" | "city" | "state" | "pincode" | "email" | "date"

export default function BookingPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      try {
        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const result = await res.json()
        if (result.success) {
          setBookingReference(result.id)
          setBookingComplete(true)
        }
      } catch (error) {
        alert("Booking failed. Please try again.")
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">E-Booking</h1>
        <p className="text-gray-600 mb-8">Book your shipment online in just a few easy steps</p>

        {!bookingComplete ? (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10"></div>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i <= step ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Shipment Details</span>
                <span>Addresses</span>
                <span>Confirmation</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipment Details</CardTitle>
                    <CardDescription>Provide package details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label>Service Type</Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(val) => setFormData({ ...formData, serviceType: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="express">Express (1–2 days)</SelectItem>
                        <SelectItem value="standard">Standard (3–5 days)</SelectItem>
                        <SelectItem value="economy">Economy (5–7 days)</SelectItem>
                      </SelectContent>
                    </Select>

                    <Label>Package Type</Label>
                    <RadioGroup
                      value={formData.packageType}
                      onValueChange={(val) => setFormData({ ...formData, packageType: val })}
                      className="flex gap-4"
                    >
                      <RadioGroupItem value="document" id="document" />
                      <Label htmlFor="document">Document</Label>
                      <RadioGroupItem value="parcel" id="parcel" />
                      <Label htmlFor="parcel">Parcel</Label>
                      <RadioGroupItem value="heavy" id="heavy" />
                      <Label htmlFor="heavy">Heavy Goods</Label>
                    </RadioGroup>

                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        placeholder="Weight (kg)"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      />
                      <Input
                        placeholder="Value (₹)"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        placeholder="Length"
                        value={formData.dimensions.length}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dimensions: { ...formData.dimensions, length: e.target.value },
                          })
                        }
                      />
                      <Input
                        placeholder="Width"
                        value={formData.dimensions.width}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dimensions: { ...formData.dimensions, width: e.target.value },
                          })
                        }
                      />
                      <Input
                        placeholder="Height"
                        value={formData.dimensions.height}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dimensions: { ...formData.dimensions, height: e.target.value },
                          })
                        }
                      />
                    </div>

                    <Textarea
                      placeholder="Package Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pickup & Delivery</CardTitle>
                    <CardDescription>Enter addresses</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Tabs defaultValue="pickup">
                      <TabsList>
                        <TabsTrigger value="pickup">Pickup</TabsTrigger>
                        <TabsTrigger value="delivery">Delivery</TabsTrigger>
                      </TabsList>
                      {["pickup", "delivery"].map((section) => (
                        <TabsContent key={section} value={section}>
                          {["name", "phone", "email", "address", "city", "state", "pincode", ...(section === "pickup" ? ["date"] : [])].map(
                            (field) => (
                              <div key={field} className="mb-2">
                                <Label>{field.toUpperCase()}</Label>
                                <Input
                                  value={formData[section as "pickup" | "delivery"][field as AddressField] || ""}
                                  onChange={(e) =>
                                    handleAddressChange(section as "pickup" | "delivery", field as AddressField, e.target.value)
                                  }
                                />
                              </div>
                            )
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Confirmation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Service:</strong> {formData.serviceType}</p>
                    <p><strong>Package:</strong> {formData.packageType}</p>
                    <p><strong>Weight:</strong> {formData.weight} kg</p>
                    <p><strong>Value:</strong> ₹{formData.value}</p>
                    <p><strong>Dimensions:</strong> {formData.dimensions.length} x {formData.dimensions.width} x {formData.dimensions.height} cm</p>
                    <p><strong>Description:</strong> {formData.description}</p>
                    <hr />
                    <p><strong>Pickup:</strong> {formData.pickup.name}, {formData.pickup.city}</p>
                    <p><strong>Delivery:</strong> {formData.delivery.name}, {formData.delivery.city}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Confirm & Book
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </form>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CheckCircle className="text-green-500 w-8 h-8" />
              <CardTitle>Booking Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">Your Booking Reference:</p>
              <p className="font-mono font-bold text-xl">{bookingReference}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => { setStep(1); setBookingComplete(false); }}>
                Book Another Shipment
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
