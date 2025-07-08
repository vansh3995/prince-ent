import { NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    // For demo purposes, create a mock user
    const userData = {
      id: 'user-' + Date.now(),
      name,
      email,
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
      message: 'Registration successful',
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

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    )
  }
}
