import { connectToDatabase } from "@/lib/db"
import { validateTeacherAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  const auth = validateTeacherAuth(request)
  if (!auth.valid || !auth.teacherId) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const teacherId = auth.teacherId
    const teacherObjectId = new ObjectId(teacherId)

    const classes = await db.collection("classes").find({
      $or: [
        { teacherIds: teacherObjectId },
        { teacherIds: teacherId }
      ]
    }).toArray()

    if (classes.length === 0) {
      return NextResponse.json([])
    }

    const studentIds = new Set<string>()
    classes.forEach(cls => {
      if (cls.studentIds && Array.isArray(cls.studentIds)) {
        cls.studentIds.forEach((id: ObjectId | string) => {
          const idStr = typeof id === 'string' ? id : id.toString()
          studentIds.add(idStr)
        })
      }
    })

    if (studentIds.size === 0) {
      return NextResponse.json([])
    }

    const studentObjectIds = Array.from(studentIds).map(id => {
      try {
        return new ObjectId(id)
      } catch {
        return null
      }
    }).filter((id): id is ObjectId => id !== null)

    if (studentObjectIds.length === 0) {
      return NextResponse.json([])
    }
    
    const students = await db.collection("students")
      .find({ _id: { $in: studentObjectIds } })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(students)
  } catch (error) {
    console.error("Failed to fetch teacher's students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
