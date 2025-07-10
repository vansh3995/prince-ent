import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// Force Node.js runtime for JWT operations
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Demo credentials - replace with database check
    const DEMO_ADMIN = {
      id: '1',
      username: 'admin',
      email: 'admin@princeenterprises.com',
      password: 'admin123',
      role: 'admin'
    }

    if (username !== DEMO_ADMIN.username) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    // For demo, simple password check. In production, use bcrypt
    if (password !== DEMO_ADMIN.password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    // Generate JWT token
    const tokenPayload = {
      id: DEMO_ADMIN.id,
      username: DEMO_ADMIN.username,
      email: DEMO_ADMIN.email,
      role: DEMO_ADMIN.role
    }

    const token = generateToken(tokenPayload)

    return NextResponse.json({
      token,
      admin: {
        id: DEMO_ADMIN.id,
        username: DEMO_ADMIN.username,
        email: DEMO_ADMIN.email,
        role: DEMO_ADMIN.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
