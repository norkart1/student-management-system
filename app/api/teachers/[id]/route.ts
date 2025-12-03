import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

interface TeacherUpdateInput {
  fullName?: string
  email?: string
  phone?: string
  imageUrl?: string
  username?: string
  password?: string
  canLogin?: boolean
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const teacher = await db.collection("teachers").findOne({
      _id: new ObjectId(id),
    })
    
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }
    
    return NextResponse.json(teacher)
  } catch (error) {
    console.error("Failed to fetch teacher:", error)
    return NextResponse.json({ error: "Failed to fetch teacher" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const data: TeacherUpdateInput = await request.json()

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    
    if (data.fullName) updateData.fullName = data.fullName.trim()
    if (data.email) updateData.email = data.email.trim().toLowerCase()
    if (data.phone) updateData.phone = data.phone.trim()
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null
    if (data.canLogin !== undefined) updateData.canLogin = data.canLogin
    
    if (data.username) {
      const existingTeacher = await db.collection("teachers").findOne({ 
        username: data.username.trim().toLowerCase(),
        _id: { $ne: new ObjectId(id) }
      })
      if (existingTeacher) {
        return NextResponse.json({ error: "Username already exists" }, { status: 400 })
      }
      updateData.username = data.username.trim().toLowerCase()
    }
    
    if (data.password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(data.password, salt)
      updateData.plainPassword = data.password
      updateData.canLogin = true
    }

    const result = await db
      .collection("teachers")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update teacher:", error)
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("teachers").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete teacher:", error)
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 })
  }
}
