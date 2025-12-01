import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface ResultInput {
  examId: string
  studentId: string
  marksObtained: number
  remarks?: string
}

function calculateGrade(percentage: number): string {
  if (percentage >= 90) return "A+"
  if (percentage >= 80) return "A"
  if (percentage >= 70) return "B+"
  if (percentage >= 60) return "B"
  if (percentage >= 50) return "C"
  if (percentage >= 40) return "D"
  return "F"
}

export async function GET(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const examId = searchParams.get("examId")
    const studentId = searchParams.get("studentId")

    const query: any = {}
    if (examId) query.examId = examId
    if (studentId) query.studentId = studentId

    const results = await db.collection("results").find(query).sort({ createdAt: -1 }).toArray()

    const enrichedResults = await Promise.all(
      results.map(async (result) => {
        const student = await db.collection("students").findOne({ _id: new ObjectId(result.studentId) })
        const exam = await db.collection("exams").findOne({ _id: new ObjectId(result.examId) })
        return {
          ...result,
          studentName: student?.fullName || "Unknown",
          studentEmail: student?.email || "",
          examName: exam?.name || "Unknown",
          subject: exam?.subject || "",
          totalMarks: exam?.totalMarks || 0,
          passingMarks: exam?.passingMarks || 0,
        }
      })
    )

    return NextResponse.json(enrichedResults)
  } catch (error) {
    console.error("Failed to fetch results:", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: ResultInput = await request.json()

    if (!data.examId || !data.studentId || data.marksObtained === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const exam = await db.collection("exams").findOne({ _id: new ObjectId(data.examId) })
    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    const student = await db.collection("students").findOne({ _id: new ObjectId(data.studentId) })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const marksObtained = Number(data.marksObtained)
    const percentage = (marksObtained / exam.totalMarks) * 100
    const grade = calculateGrade(percentage)
    const passed = marksObtained >= exam.passingMarks

    const existingResult = await db.collection("results").findOne({
      examId: data.examId,
      studentId: data.studentId,
    })

    if (existingResult) {
      await db.collection("results").updateOne(
        { _id: existingResult._id },
        {
          $set: {
            marksObtained,
            percentage: Math.round(percentage * 100) / 100,
            grade,
            passed,
            remarks: data.remarks?.trim() || "",
            updatedAt: new Date(),
          },
        }
      )
      return NextResponse.json({
        _id: existingResult._id,
        examId: data.examId,
        studentId: data.studentId,
        marksObtained,
        percentage: Math.round(percentage * 100) / 100,
        grade,
        passed,
        remarks: data.remarks?.trim() || "",
      })
    }

    const result = {
      examId: data.examId,
      studentId: data.studentId,
      marksObtained,
      percentage: Math.round(percentage * 100) / 100,
      grade,
      passed,
      remarks: data.remarks?.trim() || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection("results").insertOne(result)
    return NextResponse.json({ ...result, _id: insertResult.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create result:", error)
    return NextResponse.json({ error: "Failed to create result" }, { status: 500 })
  }
}
