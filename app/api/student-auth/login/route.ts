import { connectToDatabase } from "@/lib/db"
import { signToken } from "@/lib/jwt"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const studentUser = await db.collection("studentUsers").findOne({
      email: email.trim().toLowerCase()
    })

    if (!studentUser) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, studentUser.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = signToken({
      studentId: studentUser._id.toString(),
      email: studentUser.email,
      role: "student"
    })

    await db.collection("studentUsers").updateOne(
      { _id: studentUser._id },
      { $set: { lastLogin: new Date() } }
    )

    return NextResponse.json({
      success: true,
      token,
      student: {
        id: studentUser._id,
        fullName: studentUser.fullName,
        email: studentUser.email,
        phone: studentUser.phone,
        imageUrl: studentUser.imageUrl,
        admissionStatus: studentUser.admissionStatus,
        approvedClass: studentUser.approvedClass,
        classInfo: studentUser.classInfo
      }
    })

  } catch (error) {
    console.error("Student login error:", error)
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    )
  }
}
