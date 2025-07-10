import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload || payload.type !== 'user') {
      return NextResponse.json(
        { success: false, message: 'Invalid user token' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: payload.userId,
        name: payload.name,
        email: payload.email,
        role: payload.role
      }
    })

  } catch (error) {
    console.error('User verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Token verification failed' },
      { status: 401 }
    )
  }
}
