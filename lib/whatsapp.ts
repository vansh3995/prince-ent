import twilio from 'twilio'

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

export async function sendWhatsAppUpdate(to: string, message: string) {
  await client.messages.create({
    body: message,
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${to}`
  })
}

export async function sendTrackingUpdate(awb: string, status: string, phone: string) {
  const message = `🚚 Your shipment ${awb} is now ${status}. Track: https://princeenterprises.com/track/${awb}`
  await sendWhatsAppUpdate(phone, message)
}