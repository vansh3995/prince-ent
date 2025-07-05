import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    // Demo credentials for testing
    const credentials = {
      admin: { email: 'admin@prince.com', password: 'admin123', name: 'Admin User' },
      user: { email: 'user@prince.com', password: 'user123', name: 'Regular User' }
    }

    // Check credentials based on role
    let userRole: 'admin' | 'user' = 'user'
    let userName = ''

    if (role === 'admin' && email === credentials.admin.email && password === credentials.admin.password) {
      userRole = 'admin'
      userName = credentials.admin.name
    } else if (email === credentials.user.email && password === credentials.user.password) {
      userRole = 'user'
      userName = credentials.user.name
    } else {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create user object
    const user = {
      id: Date.now().toString(),
      name: userName,
      email,
      role: userRole
    }

    // Generate simple token (in production, use proper JWT)
    const token = `token_${user.id}_${Date.now()}`

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user,
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
