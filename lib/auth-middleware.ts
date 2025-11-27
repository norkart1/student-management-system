import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, TokenPayload } from "./jwt"

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

export function validateAuth(request: NextRequest): { valid: boolean; payload?: TokenPayload; error?: string } {
  const token = extractToken(request)
  
  if (!token) {
    return { valid: false, error: "No authorization token provided" }
  }
  
  const payload = verifyToken(token)
  
  if (!payload) {
    return { valid: false, error: "Invalid or expired token" }
  }
  
  return { valid: true, payload }
}

export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 })
}
