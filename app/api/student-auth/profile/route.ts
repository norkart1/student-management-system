import { connectToDatabase } from "@/lib/db"
import { validateStudentAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const auth = validateStudentAuth(request)
    
    if (!auth.valid || !auth.studentId) {
      return unauthorizedResponse(auth.error)
    }

    const { db } = await connectToDatabase()
    
    const student = await db.collection("studentUsers").findOne(
      { _id: new ObjectId(auth.studentId) },
      { projection: { password: 0 } }
    )

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    let classDetails = null
    if (student.approvedClass) {
      classDetails = await db.collection("classes").findOne(
        { classNumber: student.approvedClass }
      )
    }

    let enrolledBooks: any[] = []
    if (student.enrolledBooks && student.enrolledBooks.length > 0) {
      enrolledBooks = await db.collection("books")
        .find({ _id: { $in: student.enrolledBooks.map((id: string) => new ObjectId(id)) } })
        .toArray()
    }

    return NextResponse.json({
      ...student,
      classDetails,
      enrolledBooks
    })

  } catch (error) {
    console.error("Get student profile error:", error)
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = validateStudentAuth(request)
    
    if (!auth.valid || !auth.studentId) {
      return unauthorizedResponse(auth.error)
    }

    const { db } = await connectToDatabase()
    const data = await request.json()

    const allowedUpdates: any = {}
    if (data.fullName) allowedUpdates.fullName = data.fullName.trim()
    if (data.phone) allowedUpdates.phone = data.phone.trim()
    if (data.imageUrl !== undefined) allowedUpdates.imageUrl = data.imageUrl

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    allowedUpdates.updatedAt = new Date()

    await db.collection("studentUsers").updateOne(
      { _id: new ObjectId(auth.studentId) },
      { $set: allowedUpdates }
    )

    return NextResponse.json({ success: true, message: "Profile updated successfully" })

  } catch (error) {
    console.error("Update student profile error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
