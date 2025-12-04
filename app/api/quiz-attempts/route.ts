import { connectToDatabase } from "@/lib/db"
import { validateAuth, validateStudentAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface AttemptInput {
  quizId: string
  answers: { questionIndex: number; selectedAnswer: number }[]
}

export async function GET(request: NextRequest) {
  const adminAuth = validateAuth(request)
  const studentAuth = validateStudentAuth(request)
  
  if (!adminAuth.valid && !studentAuth.valid) {
    return unauthorizedResponse("Unauthorized")
  }

  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get("quizId")
    const studentId = searchParams.get("studentId")
    
    const query: any = {}
    if (quizId) query.quizId = quizId
    if (studentId) query.studentId = studentId
    
    if (studentAuth.valid && studentAuth.studentId) {
      query.studentId = studentAuth.studentId
    }

    const attempts = await db.collection("quizAttempts")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    const enrichedAttempts = await Promise.all(
      attempts.map(async (attempt) => {
        const quiz = await db.collection("quizzes").findOne({ _id: new ObjectId(attempt.quizId) })
        let studentName = "Unknown Student"
        
        const student = await db.collection("studentUsers").findOne({ _id: new ObjectId(attempt.studentId) })
        if (student) {
          studentName = student.fullName
        }
        
        return {
          ...attempt,
          quizTitle: quiz?.title || "Unknown Quiz",
          studentName,
        }
      })
    )

    return NextResponse.json(enrichedAttempts)
  } catch (error) {
    console.error("Error fetching attempts:", error)
    return NextResponse.json({ error: "Failed to fetch attempts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const studentAuth = validateStudentAuth(request)
  
  if (!studentAuth.valid || !studentAuth.studentId) {
    return unauthorizedResponse("Student authentication required")
  }

  try {
    const { db } = await connectToDatabase()
    const data: AttemptInput = await request.json()

    if (!data.quizId) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 })
    }

    if (!ObjectId.isValid(data.quizId)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const quiz = await db.collection("quizzes").findOne({ _id: new ObjectId(data.quizId) })
    
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    if (quiz.status !== "active") {
      return NextResponse.json({ error: "This quiz is not currently available" }, { status: 400 })
    }

    const existingAttempt = await db.collection("quizAttempts").findOne({
      quizId: data.quizId,
      studentId: studentAuth.studentId
    })

    if (existingAttempt) {
      return NextResponse.json({ error: "You have already attempted this quiz" }, { status: 400 })
    }

    let score = 0
    let totalPoints = 0
    const answersWithResults = data.answers.map((answer) => {
      const question = quiz.questions[answer.questionIndex]
      if (!question) return { ...answer, correct: false, points: 0 }
      
      const points = question.points || 1
      totalPoints += points
      const correct = question.correctAnswer === answer.selectedAnswer
      if (correct) score += points
      
      return {
        ...answer,
        correct,
        points: correct ? points : 0,
      }
    })

    quiz.questions.forEach((q: any, index: number) => {
      const answered = data.answers.find(a => a.questionIndex === index)
      if (!answered) {
        totalPoints += q.points || 1
      }
    })

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0
    const passed = percentage >= (quiz.passingScore || 50)

    const attempt = {
      quizId: data.quizId,
      studentId: studentAuth.studentId,
      answers: answersWithResults,
      score,
      totalPoints,
      percentage,
      passed,
      createdAt: new Date(),
    }

    const result = await db.collection("quizAttempts").insertOne(attempt)

    return NextResponse.json({
      success: true,
      attemptId: result.insertedId,
      score,
      totalPoints,
      percentage,
      passed,
      message: passed ? "Congratulations! You passed the quiz!" : "Quiz completed. Keep practicing!",
    })
  } catch (error) {
    console.error("Error submitting quiz attempt:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
