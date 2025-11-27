import { type NextRequest, NextResponse } from "next/server"
import { getAdminById, updateAdminProfile, initializeDefaultAdmin, getAdminByUsername } from "@/lib/admin"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = Buffer.from(token, "base64").toString()
    const [adminId] = decoded.split(":")

    if (!adminId) {
      await initializeDefaultAdmin()
      const admin = await getAdminByUsername("admin")
      if (admin) {
        return NextResponse.json({
          id: admin._id?.toString(),
          username: admin.username,
          email: admin.email,
          profileImage: admin.profileImage || ""
        })
      }
    }

    const admin = await getAdminById(adminId)
    if (!admin) {
      await initializeDefaultAdmin()
      const defaultAdmin = await getAdminByUsername("admin")
      if (defaultAdmin) {
        return NextResponse.json({
          id: defaultAdmin._id?.toString(),
          username: defaultAdmin.username,
          email: defaultAdmin.email,
          profileImage: defaultAdmin.profileImage || ""
        })
      }
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
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const decoded = Buffer.from(token, "base64").toString()
    const [adminId] = decoded.split(":")

    const body = await request.json()
    const { username, email, profileImage } = body

    let targetId = adminId
    if (!adminId) {
      const admin = await getAdminByUsername("admin")
      if (admin) {
        targetId = admin._id?.toString() || ""
      }
    }

    await updateAdminProfile(targetId, {
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
