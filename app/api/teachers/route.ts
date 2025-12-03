import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

interface TeacherInput {
  fullName: string
  email: string
  phone: string
  imageUrl?: string
  username?: string
  password?: string
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const teachers = await db.collection("teachers").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Failed to fetch teachers:", error)
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: TeacherInput = await request.json()

    if (!data.fullName || !data.email || !data.phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!data.username || !data.password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const existingTeacher = await db.collection("teachers").findOne({ 
      username: data.username.trim().toLowerCase() 
    })
    if (existingTeacher) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    const teacher = {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      imageUrl: data.imageUrl || null,
      username: data.username.trim().toLowerCase(),
      password: hashedPassword,
      plainPassword: data.password,
      canLogin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("teachers").insertOne(teacher)
    
    const responseTeacher = { ...teacher, _id: result.insertedId }
    delete (responseTeacher as any).password
    delete (responseTeacher as any).plainPassword
    
    return NextResponse.json(responseTeacher, { status: 201 })
  } catch (error) {
    console.error("Failed to create teacher:", error)
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 })
  }
}
