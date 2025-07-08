import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { generateToken } from '@/lib/auth'
import { seedAdminUser } from '@/lib/seed-admin'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Seed admin user if it doesn't exist
    await seedAdminUser()

    // Demo admin credentials - always allow this
    if (username === 'admin' && password === 'admin123') {
      const token = generateToken({
        adminId: '507f1f77bcf86cd799439011',
        username: 'admin',
        email: 'admin@princeenterprises.com',
        role: 'superadmin',
        type: 'admin'
      })

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        admin: {
          id: '507f1f77bcf86cd799439011',
          username: 'admin',
          email: 'admin@princeenterprises.com',
          role: 'superadmin'
        }
      })

      // Set token in cookie
      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 24 hours
      })

      return response
    }

    // Try database lookup for other admins
    try {
      const { db } = await connectToDatabase()
      const admin = await db.collection('admins').findOne({ username })

      if (!admin) {
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const isValidPassword = await bcrypt.compare(password, admin.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        )
      }

      const token = generateToken({
        adminId: admin._id.toString(),
        username: admin.username,
        email: admin.email,
        role: admin.role,
        type: 'admin'
      })

      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        admin: {
          id: admin._id.toString(),
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      })

      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400
      })

      return response
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
