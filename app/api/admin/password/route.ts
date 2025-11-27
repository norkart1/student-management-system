import { type NextRequest, NextResponse } from "next/server"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"

export async function PUT(request: NextRequest) {
  try {
    const auth = validateAuth(request)
    
    if (!auth.valid) {
      return unauthorizedResponse(auth.error)
    }

    return NextResponse.json({ 
      success: false, 
      error: "Password changes are not available in environment variable mode. Please update ADMIN_PASSWORD_HASH environment variable directly." 
    }, { status: 400 })
  } catch (error) {
    console.error("Update password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
