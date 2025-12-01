import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface ApplicationInput {
  categoryId: string
  studentId: string
}

export async function GET(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const status = searchParams.get("status")
    
    const query: any = {}
    if (categoryId) query.categoryId = categoryId
    if (status) query.status = status

    const applications = await db.collection("examApplications")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const student = await db.collection("students").findOne({ _id: new ObjectId(app.studentId) })
        const category = await db.collection("examCategories").findOne({ _id: new ObjectId(app.categoryId) })
        return {
          ...app,
          studentName: student?.fullName || "Unknown",
          studentEmail: student?.email || "",
          registrationNumber: student?.registrationNumber || "",
          studentImage: student?.imageUrl || null,
          categoryName: category?.name || "Unknown",
        }
      })
    )

    return NextResponse.json(enrichedApplications)
  } catch (error) {
    console.error("Failed to fetch applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: ApplicationInput = await request.json()

    if (!data.categoryId || !data.studentId) {
      return NextResponse.json({ error: "Category ID and Student ID are required" }, { status: 400 })
    }

    if (!ObjectId.isValid(data.categoryId) || !ObjectId.isValid(data.studentId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const category = await db.collection("examCategories").findOne({ _id: new ObjectId(data.categoryId) })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    if (category.status !== "open") {
      return NextResponse.json({ error: "This exam is not open for applications" }, { status: 400 })
    }

    const student = await db.collection("students").findOne({ _id: new ObjectId(data.studentId) })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const existingApplication = await db.collection("examApplications").findOne({
      categoryId: data.categoryId,
      studentId: data.studentId,
    })

    if (existingApplication) {
      return NextResponse.json({ error: "Student has already applied for this exam" }, { status: 400 })
    }

    const application = {
      categoryId: data.categoryId,
      studentId: data.studentId,
      registrationNumber: student.registrationNumber,
      status: "pending" as const,
      appliedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      comments: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("examApplications").insertOne(application)
    return NextResponse.json({ ...application, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create application:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}
