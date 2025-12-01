import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface BulkResultInput {
  categoryId: string
  studentId: string
  scores: Array<{
    subjectId: string
    score: number
  }>
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: BulkResultInput = await request.json()

    if (!data.categoryId || !data.studentId || !data.scores || !Array.isArray(data.scores)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!ObjectId.isValid(data.categoryId) || !ObjectId.isValid(data.studentId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const category = await db.collection("examCategories").findOne({ _id: new ObjectId(data.categoryId) })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    if (category.status !== "scoring" && category.status !== "published") {
      return NextResponse.json({ 
        error: "Scores can only be entered when category is in 'scoring' or 'published' status" 
      }, { status: 400 })
    }

    const application = await db.collection("examApplications").findOne({
      categoryId: data.categoryId,
      studentId: data.studentId,
      status: "approved"
    })

    if (!application) {
      return NextResponse.json({ 
        error: "Student is not approved for this exam" 
      }, { status: 400 })
    }

    const subjects = await db.collection("examSubjects")
      .find({ categoryId: data.categoryId })
      .toArray()

    const subjectMap = new Map(subjects.map(s => [s._id.toString(), s]))

    const results = []
    const errors = []

    for (const scoreEntry of data.scores) {
      if (!ObjectId.isValid(scoreEntry.subjectId)) {
        errors.push({ subjectId: scoreEntry.subjectId, error: "Invalid subject ID" })
        continue
      }

      const subject = subjectMap.get(scoreEntry.subjectId)
      if (!subject) {
        errors.push({ subjectId: scoreEntry.subjectId, error: "Subject not found" })
        continue
      }

      const score = Number(scoreEntry.score)
      if (score < 0 || score > subject.maxScore) {
        errors.push({ 
          subjectId: scoreEntry.subjectId, 
          error: `Score must be between 0 and ${subject.maxScore}` 
        })
        continue
      }

      const existingResult = await db.collection("examResults").findOne({
        categoryId: data.categoryId,
        studentId: data.studentId,
        subjectId: scoreEntry.subjectId,
      })

      if (existingResult) {
        await db.collection("examResults").updateOne(
          { _id: existingResult._id },
          { $set: { score, updatedAt: new Date() } }
        )
        results.push({
          _id: existingResult._id,
          subjectId: scoreEntry.subjectId,
          score,
          updated: true,
        })
      } else {
        const result = {
          categoryId: data.categoryId,
          studentId: data.studentId,
          subjectId: scoreEntry.subjectId,
          score,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        const insertResult = await db.collection("examResults").insertOne(result)
        results.push({
          _id: insertResult.insertedId,
          subjectId: scoreEntry.subjectId,
          score,
          created: true,
        })
      }
    }

    return NextResponse.json({
      success: true,
      saved: results.length,
      errors: errors.length > 0 ? errors : undefined,
      results,
    })
  } catch (error) {
    console.error("Failed to save bulk results:", error)
    return NextResponse.json({ error: "Failed to save results" }, { status: 500 })
  }
}
