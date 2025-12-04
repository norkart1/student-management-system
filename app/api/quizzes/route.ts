import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

interface QuizInput {
  title: string
  description?: string
  classId?: string
  duration?: number
  passingScore?: number
  status?: "draft" | "active" | "closed"
  isPublic?: boolean
  scheduledCloseTime?: string
  questions?: QuestionInput[]
}

interface QuestionInput {
  question: string
  type: "multiple_choice" | "true_false"
  options: string[]
  correctAnswer: number
  points?: number
}

export async function GET(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const classId = searchParams.get("classId")
    
    const query: any = {}
    if (status) query.status = status
    if (classId) query.classId = classId

    const quizzes = await db.collection("quizzes")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    const enrichedQuizzes = await Promise.all(
      quizzes.map(async (quiz) => {
        const questionCount = quiz.questions?.length || 0
        const attemptCount = await db.collection("quizAttempts").countDocuments({ quizId: quiz._id.toString() })
        
        let className = null
        if (quiz.classId) {
          const classDoc = await db.collection("classes").findOne({ _id: quiz.classId })
          className = classDoc?.name || classDoc?.classNumber
        }
        
        return {
          ...quiz,
          questionCount,
          attemptCount,
          className,
        }
      })
    )

    return NextResponse.json(enrichedQuizzes)
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: QuizInput = await request.json()

    if (!data.title?.trim()) {
      return NextResponse.json({ error: "Quiz title is required" }, { status: 400 })
    }

    const quiz = {
      title: data.title.trim(),
      description: data.description?.trim() || "",
      classId: data.classId || null,
      duration: data.duration || 30,
      passingScore: data.passingScore || 50,
      status: data.status || "draft",
      isPublic: data.isPublic || false,
      scheduledCloseTime: data.scheduledCloseTime ? new Date(data.scheduledCloseTime) : null,
      questions: data.questions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("quizzes").insertOne(quiz)
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: "Quiz created successfully" 
    })
  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
