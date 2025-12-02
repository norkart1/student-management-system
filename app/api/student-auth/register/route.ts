import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

interface StudentRegisterInput {
  fullName: string
  email: string
  phone: string
  password: string
  imageUrl?: string
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const data: StudentRegisterInput = await request.json()

    if (!data.fullName || !data.email || !data.phone || !data.password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    if (data.password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    const existingUser = await db.collection("studentUsers").findOne({
      email: data.email.trim().toLowerCase()
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const studentUser = {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      password: hashedPassword,
      imageUrl: data.imageUrl || null,
      admissionStatus: "pending",
      approvedClass: null,
      approvedAt: null,
      approvedBy: null,
      enrolledBooks: [],
      classInfo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("studentUsers").insertOne(studentUser)

    return NextResponse.json({
      success: true,
      message: "Registration successful! Please wait for admission approval.",
      userId: result.insertedId
    }, { status: 201 })

  } catch (error) {
    console.error("Student registration error:", error)
    return NextResponse.json(
      { error: "Failed to register. Please try again." },
      { status: 500 }
    )
  }
}
