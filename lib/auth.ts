import jwt, { SignOptions } from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'eNGXpvERPQTK5zSwfuCaVIgosBxU1Y6cn47Ft2ZjJlyOHri983MbqWDmALh0kd'

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}

export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return payload as any
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export function generateToken(payload: object, expiresIn: string = '24h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as SignOptions)
}

export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' } as SignOptions)
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  const token = request.cookies.get('admin-token')?.value || 
                request.cookies.get('auth-token')?.value
  
  return token || null
}
