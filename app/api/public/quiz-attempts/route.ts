import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface PublicAttemptInput {
  quizId: string
  participantName: string
  participantPhone: string
  participantPlace: string
  participantImage?: string
  answers: { questionIndex: number; selectedAnswer: number }[]
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const data: PublicAttemptInput = await request.json()

    if (!data.quizId) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 })
    }

    if (!data.participantName?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!data.participantPhone?.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    if (!data.participantPlace?.trim()) {
      return NextResponse.json({ error: "Place is required" }, { status: 400 })
    }

    if (!ObjectId.isValid(data.quizId)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const quiz = await db.collection("quizzes").findOne({ 
      _id: new ObjectId(data.quizId),
      isPublic: true,
      status: "active"
    })
    
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found or not available" }, { status: 404 })
    }

    const existingAttempt = await db.collection("publicQuizAttempts").findOne({
      quizId: data.quizId,
      participantPhone: data.participantPhone.trim()
    })

    if (existingAttempt) {
      return NextResponse.json({ error: "You have already attempted this quiz with this phone number" }, { status: 400 })
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
      quizTitle: quiz.title,
      participantName: data.participantName.trim(),
      participantPhone: data.participantPhone.trim(),
      participantPlace: data.participantPlace.trim(),
      participantImage: data.participantImage || null,
      answers: answersWithResults,
      score,
      totalPoints,
      percentage,
      passed,
      createdAt: new Date(),
    }

    const result = await db.collection("publicQuizAttempts").insertOne(attempt)

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
    console.error("Error submitting public quiz attempt:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")
    const quizId = searchParams.get("quizId")
    
    if (!phone && !quizId) {
      return NextResponse.json({ error: "Phone number or quiz ID is required" }, { status: 400 })
    }
    
    const query: any = {}
    if (phone) query.participantPhone = phone
    if (quizId) query.quizId = quizId

    const attempts = await db.collection("publicQuizAttempts")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(attempts)
  } catch (error) {
    console.error("Error fetching public quiz attempts:", error)
    return NextResponse.json({ error: "Failed to fetch attempts" }, { status: 500 })
  }
}
