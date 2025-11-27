import { type NextRequest, NextResponse } from "next/server"
import { getAdminById } from "@/lib/admin"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const auth = validateAuth(request)
    
    if (!auth.valid) {
      return unauthorizedResponse(auth.error)
    }

    const admin = await getAdminById(auth.payload!.adminId)
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      profileImage: admin.profileImage || ""
    })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = validateAuth(request)
    
    if (!auth.valid) {
      return unauthorizedResponse(auth.error)
    }

    return NextResponse.json({ 
      success: false, 
      error: "Profile updates are not available in environment variable mode. Please update environment variables directly." 
    }, { status: 400 })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
