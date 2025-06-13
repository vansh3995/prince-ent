"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-blue-100 mb-8">Get in touch with our team for inquiries, support, or feedback</p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                We're here to help with any questions you may have about our services. Reach out to us through any of
                the channels below or fill out the contact form.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Head Office</h3>
                    <p className="text-gray-600">
                      Prince Enterprises, Maur Mandi
                      <br />
                      Punjab, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-gray-600">
                      Customer Support: +91 93172 24000
                      <br />
                      Business Inquiries: +91 93172 24000
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">
                      Customer Support: princejagga165@gmail.com
                      <br />
                      Business Inquiries: princejagga165@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 9:00 AM - 6:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {!formSubmitted ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Send Us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="Email address" required />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Phone number" required />
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Select required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="quote">Request a Quote</SelectItem>
                            <SelectItem value="support">Customer Support</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="complaint">Complaint</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Please provide details about your inquiry"
                          rows={5}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h2>
                      <p className="text-green-700 mb-6">
                        Thank you for contacting Prince Enterprises. We have received your message and will get back to
                        you shortly.
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => setFormSubmitted(false)}>
                        Send Another Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find quick answers to common questions about our services</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>How do I track my shipment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You can track your shipment by entering your tracking number on our Track page or by contacting our
                  customer support team with your reference number.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What are your delivery timelines?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Delivery timelines vary based on the service selected and destination. Express delivery typically
                  takes 1-2 days for major cities, while standard delivery can take 3-5 days.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do I book a shipment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You can book a shipment through our E-Booking page, by calling our customer service, or by visiting
                  any of our branch locations with your package.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What items are prohibited for shipping?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Prohibited items include dangerous goods, perishables without proper packaging, illegal substances,
                  and valuables without declared value and insurance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
