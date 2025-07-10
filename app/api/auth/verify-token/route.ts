import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Force Node.js runtime for JWT operations
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 400 })
    }

    const payload = verifyToken(token)
    return NextResponse.json({ valid: true, payload })
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 })
  }
}
