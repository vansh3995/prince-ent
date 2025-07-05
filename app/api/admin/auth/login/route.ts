import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json()
    
    // Accept either email or username
    const loginField = email || username
    
    if (!loginField || !password) {
      return NextResponse.json(
        { message: 'Email/Username and password are required' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    
    // Search by email or username
    const admin = await db.collection('admins').findOne({
      $or: [
        { email: loginField },
        { username: loginField }
      ]
    })

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { 
        userId: admin._id,
        email: admin.email,
        role: admin.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role
      },
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
