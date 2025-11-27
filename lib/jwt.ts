import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "student-management-secret-key-change-in-production"
const JWT_EXPIRES_IN = "7d"

export interface TokenPayload {
  adminId: string
  username: string
  iat?: number
  exp?: number
}

export function signToken(payload: { adminId: string; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}
