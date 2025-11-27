import { type NextRequest, NextResponse } from "next/server"
import { getAdminById, updateAdminProfile } from "@/lib/admin"
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
      id: admin._id?.toString(),
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

    const body = await request.json()
    const { username, email, profileImage } = body

    await updateAdminProfile(auth.payload!.adminId, {
      username,
      email,
      profileImage
    })

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
