// Simple email utility without nodemailer dependency
export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  try {
    // For development, just log the email instead of sending
    console.log(' Email notification:', {
      to,
      subject,
      text,
      timestamp: new Date().toISOString()
    })
    
    // In production, you would integrate with a service like:
    // - Resend, SendGrid, AWS SES, etc.
    
    return { 
      success: true, 
      message: 'Email notification logged successfully' 
    }
  } catch (error) {
    console.error('Email utility error:', error)
    return { 
      success: false, 
      message: 'Failed to process email notification' 
    }
  }
}

export async function sendTrackingNotification(email: string, awb: string, status: string) {
  const subject = `Shipment Update - AWB: ${awb}`
  const text = `Your shipment with AWB ${awb} has been updated to: ${status}`
  
  return await sendEmail(email, subject, text)
}

// Export a simple email validator
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
