import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, type } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password required' },
        { status: 400 }
      )
    }

    // For demo purposes, use hardcoded user credentials
    if (email === 'user@example.com' && password === 'user123') {
      const userData = {
        id: 'user-001',
        name: 'Demo User',
        email: email,
        role: 'user'
      }

      const token = generateToken({
        userId: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        type: 'user'
      })

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: userData,
        token
      })

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      })

      return response
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )

  } catch (error) {
    console.error('User login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
