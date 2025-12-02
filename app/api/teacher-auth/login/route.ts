import { connectToDatabase } from "@/lib/db"
import { signToken } from "@/lib/jwt"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    const teacher = await db.collection("teachers").findOne({ 
      email: email.trim().toLowerCase() 
    })

    if (!teacher) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!teacher.password) {
      return NextResponse.json({ 
        error: "Account not set up. Please contact admin to set your password." 
      }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, teacher.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = signToken({
      teacherId: teacher._id.toString(),
      email: teacher.email,
      fullName: teacher.fullName,
      role: "teacher"
    })

    await db.collection("teachers").updateOne(
      { _id: teacher._id },
      { $set: { lastLogin: new Date() } }
    )

    return NextResponse.json({
      token,
      success: true,
      teacher: {
        id: teacher._id.toString(),
        fullName: teacher.fullName,
        email: teacher.email,
        imageUrl: teacher.imageUrl
      }
    })
  } catch (error) {
    console.error("Teacher login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
