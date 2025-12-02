import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, TokenPayload, AdminTokenPayload, StudentTokenPayload, TeacherTokenPayload } from "./jwt"

export interface AuthenticatedRequest extends NextRequest {
  admin?: TokenPayload
}

export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.replace("Bearer ", "")
}

function isAdminToken(payload: TokenPayload): payload is AdminTokenPayload {
  return 'adminId' in payload && 'username' in payload
}

function isStudentToken(payload: TokenPayload): payload is StudentTokenPayload {
  return 'studentId' in payload && 'role' in payload && payload.role === 'student'
}

function isTeacherToken(payload: TokenPayload): payload is TeacherTokenPayload {
  return 'teacherId' in payload && 'role' in payload && payload.role === 'teacher'
}

export function validateAuth(request: NextRequest): { valid: boolean; payload?: TokenPayload; adminId?: string; error?: string } {
  const token = extractToken(request)
  
  if (!token) {
    return { valid: false, error: "No authorization token provided" }
  }
  
  const payload = verifyToken(token)
  
  if (!payload) {
    return { valid: false, error: "Invalid or expired token" }
  }
  
  if (isAdminToken(payload)) {
    return { valid: true, payload, adminId: payload.adminId }
  }
  
  return { valid: true, payload }
}

export function validateTeacherAuth(request: NextRequest): { valid: boolean; payload?: TeacherTokenPayload; teacherId?: string; error?: string } {
  const token = extractToken(request)
  
  if (!token) {
    return { valid: false, error: "No authorization token provided" }
  }
  
  const payload = verifyToken(token)
  
  if (!payload) {
    return { valid: false, error: "Invalid or expired token" }
  }
  
  if (!isTeacherToken(payload)) {
    return { valid: false, error: "Not a teacher token" }
  }
  
  return { valid: true, payload, teacherId: payload.teacherId }
}

export function validateTeacherOrAdminAuth(request: NextRequest): { valid: boolean; payload?: TokenPayload; teacherId?: string; adminId?: string; error?: string } {
  const token = extractToken(request)
  
  if (!token) {
    return { valid: false, error: "No authorization token provided" }
  }
  
  const payload = verifyToken(token)
  
  if (!payload) {
    return { valid: false, error: "Invalid or expired token" }
  }
  
  if (isAdminToken(payload)) {
    return { valid: true, payload, adminId: payload.adminId }
  }
  
  if (isTeacherToken(payload)) {
    return { valid: true, payload, teacherId: payload.teacherId }
  }
  
  return { valid: false, error: "Not authorized" }
}

export function validateStudentAuth(request: NextRequest): { valid: boolean; payload?: StudentTokenPayload; studentId?: string; error?: string } {
  const token = extractToken(request)
  
  if (!token) {
    return { valid: false, error: "No authorization token provided" }
  }
  
  const payload = verifyToken(token)
  
  if (!payload) {
    return { valid: false, error: "Invalid or expired token" }
  }
  
  if (!isStudentToken(payload)) {
    return { valid: false, error: "Not a student token" }
  }
  
  return { valid: true, payload, studentId: payload.studentId }
}

export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 })
}
