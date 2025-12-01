import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { Db } from "mongodb"

async function generateRegistrationNumber(db: Db): Promise<string> {
  const year = new Date().getFullYear()
  const lastStudent = await db.collection("students")
    .find({ registrationNumber: { $regex: `^STU${year}` } })
    .sort({ registrationNumber: -1 })
    .limit(1)
    .toArray()
  
  let nextNumber = 1
  if (lastStudent.length > 0 && lastStudent[0].registrationNumber) {
    const lastNum = parseInt(lastStudent[0].registrationNumber.slice(-4))
    nextNumber = lastNum + 1
  }
  
  return `STU${year}${nextNumber.toString().padStart(4, '0')}`
}

interface StudentInput {
  fullName: string
  email: string
  phone: string
  registrationNumber?: string
  imageUrl?: string
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const students = await db.collection("students").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(students)
  } catch (error) {
    console.error("Failed to fetch students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: StudentInput = await request.json()

    if (!data.fullName || !data.email || !data.phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const registrationNumber = data.registrationNumber || await generateRegistrationNumber(db)

    const student = {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      registrationNumber: registrationNumber,
      imageUrl: data.imageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("students").insertOne(student)
    return NextResponse.json({ ...student, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create student:", error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}
