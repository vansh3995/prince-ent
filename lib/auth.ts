﻿import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'prince-enterprises-secret-key-2024'

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}
