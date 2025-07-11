// Custom Razorpay types
declare module "razorpay" {
  interface RazorpayOptions {
    key_id: string
    key_secret: string
  }

  interface RazorpayOrderOptions {
    amount: number
    currency: string
    receipt?: string
    notes?: Record<string, string>
  }

  interface RazorpayOrder {
    id: string
    entity: string
    amount: number
    amount_paid: number
    amount_due: number
    currency: string
    receipt: string
    offer_id: string | null
    status: string
    attempts: number
    notes: Record<string, string>
    created_at: number
  }

  interface RazorpayPayment {
    id: string
    entity: string
    amount: number
    currency: string
    status: string
    order_id: string
    invoice_id: string | null
    international: boolean
    method: string
    amount_refunded: number
    refund_status: string | null
    captured: boolean
    description: string
    card_id: string | null
    bank: string | null
    wallet: string | null
    vpa: string | null
    email: string
    contact: string
    notes: Record<string, string>
    fee: number
    tax: number
    error_code: string | null
    error_description: string | null
    created_at: number
  }

  class Razorpay {
    constructor(options: RazorpayOptions)
    orders: {
      create(options: RazorpayOrderOptions): Promise<RazorpayOrder>
      fetch(orderId: string): Promise<RazorpayOrder>
      fetchPayments(orderId: string): Promise<{ items: RazorpayPayment[] }>
    }
    payments: {
      fetch(paymentId: string): Promise<RazorpayPayment>
      capture(paymentId: string, amount: number, currency: string): Promise<RazorpayPayment>
    }
  }

  export = Razorpay
}

// Client-side Razorpay types
declare global {
  interface Window {
    Razorpay: any
  }
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  image?: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}