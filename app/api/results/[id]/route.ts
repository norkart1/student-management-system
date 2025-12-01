import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return "A+"
  if (percentage >= 80) return "A"
  if (percentage >= 70) return "B+"
  if (percentage >= 60) return "B"
  if (percentage >= 50) return "C"
  if (percentage >= 40) return "D"
  return "F"
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid result ID" }, { status: 400 })
    }

    const result = await db.collection("results").findOne({ _id: new ObjectId(id) })
    
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    const student = await db.collection("students").findOne({ _id: new ObjectId(result.studentId) })
    const exam = await db.collection("exams").findOne({ _id: new ObjectId(result.examId) })

    return NextResponse.json({
      ...result,
      studentName: student?.fullName || "Unknown",
      studentEmail: student?.email || "",
      examName: exam?.name || "Unknown",
      subject: exam?.subject || "",
      totalMarks: exam?.totalMarks || 0,
      passingMarks: exam?.passingMarks || 0,
    })
  } catch (error) {
    console.error("Failed to fetch result:", error)
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const data = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid result ID" }, { status: 400 })
    }

    const existingResult = await db.collection("results").findOne({ _id: new ObjectId(id) })
    if (!existingResult) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    const exam = await db.collection("exams").findOne({ _id: new ObjectId(existingResult.examId) })
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    const marksObtained = Number(data.marksObtained)
    const percentage = (marksObtained / exam.totalMarks) * 100
    const grade = calculateGrade(percentage)
    const passed = marksObtained >= exam.passingMarks

    const updateData = {
      marksObtained,
      percentage: Math.round(percentage * 100) / 100,
      grade,
      passed,
      remarks: data.remarks?.trim() || "",
      updatedAt: new Date(),
    }

    await db.collection("results").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    return NextResponse.json({ _id: id, ...existingResult, ...updateData })
  } catch (error) {
    console.error("Failed to update result:", error)
    return NextResponse.json({ error: "Failed to update result" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid result ID" }, { status: 400 })
    }

    const result = await db.collection("results").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete result:", error)
    return NextResponse.json({ error: "Failed to delete result" }, { status: 500 })
  }
}
