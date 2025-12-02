import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    const classData = await db.collection("classes").aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "students",
          localField: "studentIds",
          foreignField: "_id",
          as: "students"
        }
      },
      {
        $lookup: {
          from: "teachers",
          localField: "teacherIds",
          foreignField: "_id",
          as: "teachers"
        }
      }
    ]).toArray()

    if (classData.length === 0) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    return NextResponse.json(classData[0])
  } catch (error) {
    console.error("Failed to fetch class:", error)
    return NextResponse.json({ error: "Failed to fetch class" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const data = await request.json()

    const updateData: any = {
      updatedAt: new Date()
    }

    if (data.name !== undefined) updateData.name = data.name.trim()
    if (data.description !== undefined) updateData.description = data.description.trim()
    if (data.academicYear !== undefined) updateData.academicYear = data.academicYear
    if (data.section !== undefined) updateData.section = data.section?.trim() || null
    
    if (data.studentIds !== undefined) {
      updateData.studentIds = data.studentIds.map((id: string) => new ObjectId(id))
    }
    
    if (data.teacherIds !== undefined) {
      updateData.teacherIds = data.teacherIds.map((id: string) => new ObjectId(id))
    }

    const result = await db.collection("classes").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const updatedClass = await db.collection("classes").findOne({ _id: new ObjectId(id) })
    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error("Failed to update class:", error)
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    const result = await db.collection("classes").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Class deleted successfully" })
  } catch (error) {
    console.error("Failed to delete class:", error)
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 })
  }
}
