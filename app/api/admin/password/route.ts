import { type NextRequest, NextResponse } from "next/server"
import { getAdminById, updateAdminPassword, getAdminByUsername, initializeDefaultAdmin } from "@/lib/admin"

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = Buffer.from(token, "base64").toString()
    const [adminId] = decoded.split(":")

    const body = await request.json()
    const { currentPassword, newPassword } = body

    let admin = null
    if (adminId) {
      admin = await getAdminById(adminId)
    }
    
    if (!admin) {
      await initializeDefaultAdmin()
      admin = await getAdminByUsername("admin")
    }

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    if (admin.password !== currentPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    await updateAdminPassword(admin._id!.toString(), newPassword)

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Update password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
