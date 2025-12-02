import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface StudentUpdateInput {
  fullName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  imageUrl?: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const student = await db.collection("students").findOne({
      _id: new ObjectId(id),
    })
    
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }
    
    return NextResponse.json(student)
  } catch (error) {
    console.error("Failed to fetch student:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
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
    const data: StudentUpdateInput = await request.json()

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    
    if (data.fullName) updateData.fullName = data.fullName.trim()
    if (data.email) updateData.email = data.email.trim().toLowerCase()
    if (data.phone) updateData.phone = data.phone.trim()
    if (data.dateOfBirth) updateData.dateOfBirth = data.dateOfBirth
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null

    const result = await db
      .collection("students")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update student:", error)
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
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
    const result = await db.collection("students").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete student:", error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}
