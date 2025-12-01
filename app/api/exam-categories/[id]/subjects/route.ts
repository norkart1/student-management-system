import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface SubjectInput {
  name: string
  maxScore: number
  order?: number
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    const subjects = await db.collection("examSubjects")
      .find({ categoryId: id })
      .sort({ order: 1 })
      .toArray()

    return NextResponse.json(subjects)
  } catch (error) {
    console.error("Failed to fetch subjects:", error)
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const data: SubjectInput = await request.json()

    if (!data.name || !data.maxScore) {
      return NextResponse.json({ error: "Subject name and max score are required" }, { status: 400 })
    }

    const category = await db.collection("examCategories").findOne({ _id: new ObjectId(id) })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const subjectCount = await db.collection("examSubjects").countDocuments({ categoryId: id })

    const subject = {
      categoryId: id,
      name: data.name.trim(),
      maxScore: Number(data.maxScore),
      order: data.order ?? subjectCount + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("examSubjects").insertOne(subject)
    return NextResponse.json({ ...subject, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create subject:", error)
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 })
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
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get("subjectId")

    if (!subjectId || !ObjectId.isValid(subjectId)) {
      return NextResponse.json({ error: "Invalid subject ID" }, { status: 400 })
    }

    await db.collection("examResults").deleteMany({ subjectId })

    const result = await db.collection("examSubjects").deleteOne({ 
      _id: new ObjectId(subjectId),
      categoryId: id 
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete subject:", error)
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 })
  }
}
