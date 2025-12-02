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
    
    const teacher = await db.collection("teachers").findOne(
      { _id: new ObjectId(auth.teacherId) },
      { projection: { password: 0 } }
    )

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: teacher._id.toString(),
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone,
      imageUrl: teacher.imageUrl
    })
  } catch (error) {
    console.error("Failed to fetch teacher profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
