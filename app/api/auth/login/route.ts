import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('🔐 Admin login attempt for:', email)

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // Find user by email
    const user = await db.collection('users').findOne({ email })
    console.log('👤 User found:', user ? `Yes (${user.role})` : 'No')
    
    console.log('🔍 Found user:', user ? 'YES' : 'NO');
    console.log('🔍 Database name:', db.databaseName);
    console.log('🔍 Search email:', email);
    
    // Debug: Check all users in collection
    const allUsers = await db.collection('users').find({}).toArray()
    console.log('📊 Total users in DB:', allUsers.length);
    allUsers.forEach((u, index) => {
      console.log(`👤 User ${index + 1}: ${u.email} (${u.role})`);
    });
    
    if (user) {
      console.log('👤 User role:', user.role);
      console.log('🔐 Hash password:', !!user.password);
      console.log('📧 Email match:', user.email === email);
      console.log('📧 Email lowercase match:', user.email === email.toLowerCase());
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('🔑 Password valid:', isPasswordValid)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    )

    console.log('✅ Admin login successful for:', email)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      },
      token: token
    })

    // Set HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/'
    })

    return response

  } catch (error) {
    console.error('❌ Admin login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
