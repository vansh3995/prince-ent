"use client"

import type React from "react"

import { useState } from "react"
import { Calculator, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function QuotePage() {
  const [quoteSubmitted, setQuoteSubmitted] = useState(false)
  const [quoteReference, setQuoteReference] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Form se sabhi values nikaalo
    const formData = {
      // Shipment Details
      serviceType: (document.getElementById("service-type") as HTMLInputElement)?.value || "",
      shipmentType: (document.querySelector('input[name="shipment-type"]:checked') as HTMLInputElement)?.value || "",
      origin: (document.getElementById("origin") as HTMLInputElement)?.value || "",
      destination: (document.getElementById("destination") as HTMLInputElement)?.value || "",
      weight: (document.getElementById("weight") as HTMLInputElement)?.value || "",
      packages: (document.getElementById("packages") as HTMLInputElement)?.value || "",
      description: (document.getElementById("description") as HTMLInputElement)?.value || "",
      // Contact Info
      firstName: (document.getElementById("first-name") as HTMLInputElement)?.value || "",
      lastName: (document.getElementById("last-name") as HTMLInputElement)?.value || "",
      company: (document.getElementById("company") as HTMLInputElement)?.value || "",
      email: (document.getElementById("email") as HTMLInputElement)?.value || "",
      phone: (document.getElementById("phone") as HTMLInputElement)?.value || "",
      additional: (document.getElementById("additional") as HTMLInputElement)?.value || "",
    }
    // API pe bhejo
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    if (res.ok) {
      const reference = "QT" + Math.floor(100000 + Math.random() * 900000)
      setQuoteReference(reference)
      setQuoteSubmitted(true)
    } else {
      alert("Failed to submit quote. Please try again.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Request a Quote</h1>
        <p className="text-gray-600 mb-8">Get a customized quote for your logistics requirements</p>

        {!quoteSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Shipment Details</CardTitle>
                  <CardDescription>Provide information about your shipment requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="service-type">Service Type</Label>
                    <Select required defaultValue="express">
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="express">Express Delivery</SelectItem>
                        <SelectItem value="standard">Standard Delivery</SelectItem>
                        <SelectItem value="economy">Economy Delivery</SelectItem>
                        <SelectItem value="freight">Freight Transport</SelectItem>
                        <SelectItem value="custom">Custom Solution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Shipment Type</Label>
                    <RadioGroup defaultValue="one-time" className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center space-x-2 border rounded-md p-4">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time" className="flex-1 cursor-pointer">
                          One-time Shipment
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-4">
                        <RadioGroupItem value="recurring" id="recurring" />
                        <Label htmlFor="recurring" className="flex-1 cursor-pointer">
                          Recurring Shipments
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="origin">Origin City</Label>
                      <Input id="origin" placeholder="City name" required />
                    </div>
                    <div>
                      <Label htmlFor="destination">Destination City</Label>
                      <Input id="destination" placeholder="City name" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Approx. Weight (kg)</Label>
                      <Input id="weight" type="number" min="0.1" step="0.1" placeholder="Total weight" required />
                    </div>
                    <div>
                      <Label htmlFor="packages">Number of Packages</Label>
                      <Input id="packages" type="number" min="1" placeholder="Number of items" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Shipment Description</Label>
                    <Textarea id="description" placeholder="Briefly describe your shipment requirements" required />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Provide your contact details so we can send you the quote</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="First name" required />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Last name" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Company name (optional)" />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Email address" required />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Phone number" required />
                  </div>

                  <div>
                    <Label htmlFor="additional">Additional Information</Label>
                    <Textarea
                      id="additional"
                      placeholder="Any additional details that might help us provide an accurate quote"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    <Calculator className="mr-2 h-4 w-4" />
                    Request Quote
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Quote Request Submitted!</h2>
                <p className="text-green-700 mb-4">
                  Your quote request has been submitted successfully. Our team will prepare a customized quote for you.
                </p>
                <div className="bg-white rounded-lg border border-green-200 px-6 py-4 mb-6">
                  <p className="text-gray-600 mb-1">Quote Reference</p>
                  <p className="text-2xl font-mono font-bold">{quoteReference}</p>
                </div>
                <p className="text-gray-600 mb-6">
                  We will contact you within 24 hours with your personalized quote. A confirmation email has been sent
                  to your email address.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-red-600 hover:bg-red-700" onClick={() => window.print()}>
                    Print Quote Request
                  </Button>
                  <Button variant="outline" onClick={() => setQuoteSubmitted(false)}>
                    Submit Another Request
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
