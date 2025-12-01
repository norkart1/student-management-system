import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

interface ExamInput {
  name: string
  subject: string
  date: string
  totalMarks: number
  passingMarks: number
  description?: string
}

export async function GET(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const exams = await db.collection("exams").find({}).sort({ date: -1 }).toArray()
    return NextResponse.json(exams)
  } catch (error) {
    console.error("Failed to fetch exams:", error)
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: ExamInput = await request.json()

    if (!data.name || !data.subject || !data.date || !data.totalMarks) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const exam = {
      name: data.name.trim(),
      subject: data.subject.trim(),
      date: data.date,
      totalMarks: Number(data.totalMarks),
      passingMarks: Number(data.passingMarks) || Math.floor(Number(data.totalMarks) * 0.4),
      description: data.description?.trim() || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("exams").insertOne(exam)
    return NextResponse.json({ ...exam, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create exam:", error)
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 })
  }
}
