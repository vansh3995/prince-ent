import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Login attempt:', { email, password })

    // Demo user - replace with database check
    const DEMO_USER = {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      phone: '+91 9876543210',
      password: 'demo123',
      role: 'user'
    }

    // Validate credentials
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const tokenPayload = {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      role: DEMO_USER.role
    }

    const token = generateToken(tokenPayload)

    // User data to return (without password)
    const userData = {
      id: DEMO_USER.id,
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      phone: DEMO_USER.phone,
      role: DEMO_USER.role
    }

    console.log('Login successful:', { userData, token })

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
