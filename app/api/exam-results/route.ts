import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface ResultInput {
  categoryId: string
  studentId: string
  subjectId: string
  score: number
}

export async function GET(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const studentId = searchParams.get("studentId")
    const subjectId = searchParams.get("subjectId")

    const query: any = {}
    if (categoryId) query.categoryId = categoryId
    if (studentId) query.studentId = studentId
    if (subjectId) query.subjectId = subjectId

    const results = await db.collection("examResults")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    const enrichedResults = await Promise.all(
      results.map(async (result) => {
        const student = await db.collection("students").findOne({ _id: new ObjectId(result.studentId) })
        const subject = await db.collection("examSubjects").findOne({ _id: new ObjectId(result.subjectId) })
        const category = await db.collection("examCategories").findOne({ _id: new ObjectId(result.categoryId) })
        
        return {
          ...result,
          studentName: student?.fullName || "Unknown",
          studentEmail: student?.email || "",
          registrationNumber: student?.registrationNumber || "",
          subjectName: subject?.name || "Unknown",
          maxScore: subject?.maxScore || 0,
          categoryName: category?.name || "Unknown",
        }
      })
    )

    return NextResponse.json(enrichedResults)
  } catch (error) {
    console.error("Failed to fetch exam results:", error)
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

    if (!data.categoryId || !data.studentId || !data.subjectId || data.score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!ObjectId.isValid(data.categoryId) || !ObjectId.isValid(data.studentId) || !ObjectId.isValid(data.subjectId)) {
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

    const subject = await db.collection("examSubjects").findOne({ _id: new ObjectId(data.subjectId) })
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    if (subject.categoryId !== data.categoryId) {
      return NextResponse.json({ error: "Subject does not belong to this category" }, { status: 400 })
    }

    const score = Number(data.score)
    if (score < 0 || score > subject.maxScore) {
      return NextResponse.json({ 
        error: `Score must be between 0 and ${subject.maxScore}` 
      }, { status: 400 })
    }

    const existingResult = await db.collection("examResults").findOne({
      categoryId: data.categoryId,
      studentId: data.studentId,
      subjectId: data.subjectId,
    })

    if (existingResult) {
      await db.collection("examResults").updateOne(
        { _id: existingResult._id },
        {
          $set: {
            score,
            updatedAt: new Date(),
          },
        }
      )
      return NextResponse.json({
        _id: existingResult._id,
        categoryId: data.categoryId,
        studentId: data.studentId,
        subjectId: data.subjectId,
        score,
        updated: true,
      })
    }

    const result = {
      categoryId: data.categoryId,
      studentId: data.studentId,
      subjectId: data.subjectId,
      score,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection("examResults").insertOne(result)
    return NextResponse.json({ ...result, _id: insertResult.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to save exam result:", error)
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 })
  }
}
