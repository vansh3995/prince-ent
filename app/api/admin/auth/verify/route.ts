import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
    return NextResponse.json({ payload })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
