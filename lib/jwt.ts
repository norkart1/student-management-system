import jwt from "jsonwebtoken"

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined")
  }
  return secret
}

const JWT_EXPIRES_IN = "7d"

export interface AdminTokenPayload {
  adminId: string
  username: string
  iat?: number
  exp?: number
}

export interface StudentTokenPayload {
  studentId: string
  email: string
  role: "student"
  iat?: number
  exp?: number
}

export interface TeacherTokenPayload {
  teacherId: string
  email: string
  fullName: string
  role: "teacher"
  iat?: number
  exp?: number
}

export type TokenPayload = AdminTokenPayload | StudentTokenPayload | TeacherTokenPayload

export function signToken(payload: { adminId: string; username: string } | { studentId: string; email: string; role: "student" } | { teacherId: string; email: string; fullName: string; role: "teacher" }): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload
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
