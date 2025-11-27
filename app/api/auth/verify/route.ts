import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1]

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const payload = verifyToken(token)
    
    if (payload) {
      return NextResponse.json({ 
        authenticated: true, 
        username: payload.username,
        adminId: payload.adminId
      })
    }
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}
