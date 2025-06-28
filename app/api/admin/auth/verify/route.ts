import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const secret = process.env.JWT_SECRET || 'your-secret-key'

    try {
      const decoded = jwt.verify(token, secret) as any
      
      // Return user data (you might want to fetch from database)
      const user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role || 'admin'
      }

      return NextResponse.json({
        success: true,
        user
      })
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}