import { type NextRequest, NextResponse } from "next/server"
import { getAdminById, updateAdminPassword, verifyAdminPassword } from "@/lib/admin"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"

export async function PUT(request: NextRequest) {
  try {
    const auth = validateAuth(request)
    
    if (!auth.valid) {
      return unauthorizedResponse(auth.error)
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new passwords are required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
    }

    const admin = await getAdminById(auth.payload!.adminId)
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    const isCurrentPasswordValid = await verifyAdminPassword(auth.payload!.adminId, currentPassword)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    await updateAdminPassword(auth.payload!.adminId, newPassword)

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Update password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
