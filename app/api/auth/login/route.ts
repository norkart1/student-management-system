import { validateAdminCredentials } from "@/lib/admin"
import { signToken } from "@/lib/jwt"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const admin = await validateAdminCredentials(username, password)
    
    if (admin) {
      const token = signToken({
        adminId: admin.id,
        username: admin.username
      })
      
      return NextResponse.json({ 
        token, 
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          profileImage: admin.profileImage
        }
      })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
