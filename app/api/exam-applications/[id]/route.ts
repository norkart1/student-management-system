import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 })
    }

    const application = await db.collection("examApplications").findOne({ _id: new ObjectId(id) })
    
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const student = await db.collection("students").findOne({ _id: new ObjectId(application.studentId) })
    const category = await db.collection("examCategories").findOne({ _id: new ObjectId(application.categoryId) })

    return NextResponse.json({
      ...application,
      studentName: student?.fullName || "Unknown",
      studentEmail: student?.email || "",
      registrationNumber: student?.registrationNumber || "",
      categoryName: category?.name || "Unknown",
    })
  } catch (error) {
    console.error("Failed to fetch application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const data = await request.json()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 })
    }

    if (!data.status || !["pending", "approved", "rejected"].includes(data.status)) {
      return NextResponse.json({ error: "Valid status is required (pending, approved, rejected)" }, { status: 400 })
    }

    const updateData: any = {
      status: data.status,
      updatedAt: new Date(),
    }

    if (data.status === "approved" || data.status === "rejected") {
      updateData.reviewedAt = new Date()
      updateData.reviewedBy = data.reviewedBy || null
    }

    if (data.comments !== undefined) {
      updateData.comments = data.comments
    }

    const result = await db.collection("examApplications").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    )

    if (!result) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to update application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 })
    }

    const result = await db.collection("examApplications").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete application:", error)
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
  }
}
