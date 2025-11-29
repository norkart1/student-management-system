import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface DeleteDeviceInput {
  deviceId: string
}

export async function GET(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const devices = await db.collection("devices")
      .find({ adminId: auth.payload!.adminId })
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
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { deviceId }: DeleteDeviceInput = await request.json()

    if (!deviceId) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 })
    }

    if (!ObjectId.isValid(deviceId)) {
      return NextResponse.json({ error: "Invalid device ID format" }, { status: 400 })
    }
    
    const { db } = await connectToDatabase()
    const result = await db.collection("devices").deleteOne({ 
      _id: new ObjectId(deviceId),
      adminId: auth.payload!.adminId 
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing device:", error)
    return NextResponse.json({ error: "Failed to remove device" }, { status: 500 })
  }
}
