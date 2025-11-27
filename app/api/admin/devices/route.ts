import { connectToDatabase } from "@/lib/db"
import { verifyToken } from "@/lib/jwt"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const devices = await db.collection("devices")
      .find({ adminId: payload.adminId })
      .sort({ lastActive: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json(devices)
  } catch (error) {
    console.error("Error fetching devices:", error)
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { deviceId } = await request.json()
    
    const { db } = await connectToDatabase()
    await db.collection("devices").deleteOne({ 
      _id: deviceId,
      adminId: payload.adminId 
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing device:", error)
    return NextResponse.json({ error: "Failed to remove device" }, { status: 500 })
  }
}
