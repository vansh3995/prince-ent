import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Find admin user
    let admin = await db.collection('admins').findOne({ username })

    // If no admin exists, create default admin
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      const defaultAdmin = {
        username: 'admin',
        email: 'admin@prince-enterprise.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date()
      }

      const insertResult = await db.collection('admins').insertOne(defaultAdmin)
      
      if (username === 'admin') {
        admin = await db.collection('admins').findOne({ _id: insertResult.insertedId })
      }
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'fallback-secret-key'
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      },
      secret,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}