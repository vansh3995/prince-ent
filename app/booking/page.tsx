"use client"

import type React from "react"

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

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Generate a random booking reference
      const reference = "PE" + Math.floor(100000000 + Math.random() * 900000000)
      setBookingReference(reference)
      setBookingComplete(true)
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
                    <CardDescription>Provide information about your package and service requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="service-type">Service Type</Label>
                        <Select required defaultValue="express">
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="express">Express Delivery (1-2 days)</SelectItem>
                            <SelectItem value="standard">Standard Delivery (3-5 days)</SelectItem>
                            <SelectItem value="economy">Economy Delivery (5-7 days)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Package Type</Label>
                        <RadioGroup defaultValue="parcel" className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          <div className="flex items-center space-x-2 border rounded-md p-4">
                            <RadioGroupItem value="document" id="document" />
                            <Label htmlFor="document" className="flex-1 cursor-pointer">
                              Document
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-4">
                            <RadioGroupItem value="parcel" id="parcel" />
                            <Label htmlFor="parcel" className="flex-1 cursor-pointer">
                              Parcel
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-md p-4">
                            <RadioGroupItem value="heavy" id="heavy" />
                            <Label htmlFor="heavy" className="flex-1 cursor-pointer">
                              Heavy Goods
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input id="weight" type="number" min="0.1" step="0.1" placeholder="Enter weight" required />
                        </div>
                        <div>
                          <Label htmlFor="value">Declared Value (₹)</Label>
                          <Input id="value" type="number" min="1" placeholder="Enter value" required />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="dimensions">Dimensions (cm)</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Input id="length" placeholder="Length" type="number" min="1" required />
                          <Input id="width" placeholder="Width" type="number" min="1" required />
                          <Input id="height" placeholder="Height" type="number" min="1" required />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Package Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Briefly describe the contents of your package"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pickup & Delivery Addresses</CardTitle>
                    <CardDescription>Provide the pickup and delivery locations for your shipment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="pickup">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pickup">Pickup Details</TabsTrigger>
                        <TabsTrigger value="delivery">Delivery Details</TabsTrigger>
                      </TabsList>

                      <TabsContent value="pickup" className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="pickup-name">Contact Name</Label>
                            <Input id="pickup-name" placeholder="Full name" required />
                          </div>
                          <div>
                            <Label htmlFor="pickup-phone">Phone Number</Label>
                            <Input id="pickup-phone" placeholder="Phone number" required />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="pickup-address">Address</Label>
                          <Textarea id="pickup-address" placeholder="Street address" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="pickup-city">City</Label>
                            <Input id="pickup-city" placeholder="City" required />
                          </div>
                          <div>
                            <Label htmlFor="pickup-state">State</Label>
                            <Input id="pickup-state" placeholder="State" required />
                          </div>
                          <div>
                            <Label htmlFor="pickup-pincode">PIN Code</Label>
                            <Input id="pickup-pincode" placeholder="PIN code" required />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="pickup-date">Pickup Date</Label>
                          <Input id="pickup-date" type="date" required />
                        </div>
                      </TabsContent>

                      <TabsContent value="delivery" className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="delivery-name">Contact Name</Label>
                            <Input id="delivery-name" placeholder="Full name" required />
                          </div>
                          <div>
                            <Label htmlFor="delivery-phone">Phone Number</Label>
                            <Input id="delivery-phone" placeholder="Phone number" required />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="delivery-address">Address</Label>
                          <Textarea id="delivery-address" placeholder="Street address" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="delivery-city">City</Label>
                            <Input id="delivery-city" placeholder="City" required />
                          </div>
                          <div>
                            <Label htmlFor="delivery-state">State</Label>
                            <Input id="delivery-state" placeholder="State" required />
                          </div>
                          <div>
                            <Label htmlFor="delivery-pincode">PIN Code</Label>
                            <Input id="delivery-pincode" placeholder="PIN code" required />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Confirm Booking</CardTitle>
                    <CardDescription>Review your shipment details and confirm your booking</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border rounded-md p-4 space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">Shipment Summary</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-gray-600">Service Type:</div>
                          <div>Express Delivery (1-2 days)</div>

                          <div className="text-gray-600">Package Type:</div>
                          <div>Parcel</div>

                          <div className="text-gray-600">Weight:</div>
                          <div>5 kg</div>

                          <div className="text-gray-600">Dimensions:</div>
                          <div>30 × 20 × 15 cm</div>

                          <div className="text-gray-600">Declared Value:</div>
                          <div>₹5,000</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold">Pickup Address</h3>
                          <p className="text-gray-600">
                            John Doe
                            <br />
                            123 Main Street
                            <br />
                            Delhi, Delhi
                            <br />
                            110001
                            <br />
                            +91 9876543210
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold">Delivery Address</h3>
                          <p className="text-gray-600">
                            Jane Smith
                            <br />
                            456 Park Avenue
                            <br />
                            Mumbai, Maharashtra
                            <br />
                            400001
                            <br />
                            +91 9876543211
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold">Estimated Cost</h3>
                        <div className="border-t mt-2 pt-2">
                          <div className="flex justify-between">
                            <span>Base Charge</span>
                            <span>₹500</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Weight Charge</span>
                            <span>₹250</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GST (18%)</span>
                            <span>₹135</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t mt-2 pt-2">
                            <span>Total</span>
                            <span>₹885</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input type="checkbox" id="terms" className="mt-1" required />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the terms and conditions, including the prohibited items policy and liability
                        limitations of Prince Enterprises.
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Confirm Booking
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </form>
          </>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Successful!</h2>
                <p className="text-green-700 mb-4">
                  Your shipment has been booked successfully. We will contact you shortly to confirm the pickup.
                </p>
                <div className="bg-white rounded-lg border border-green-200 px-6 py-4 mb-6">
                  <p className="text-gray-600 mb-1">Booking Reference</p>
                  <p className="text-2xl font-mono font-bold">{bookingReference}</p>
                </div>
                <p className="text-gray-600 mb-6">
                  A confirmation email has been sent to your registered email address with all the details.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-red-600 hover:bg-red-700" onClick={() => window.print()}>
                    Print Booking Details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBookingComplete(false)
                      setStep(1)
                    }}
                  >
                    Book Another Shipment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
