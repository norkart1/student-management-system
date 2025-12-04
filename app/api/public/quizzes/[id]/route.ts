import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const quiz = await db.collection("quizzes").findOne({ 
      _id: new ObjectId(id),
      isPublic: true,
      status: "active"
    })
    
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found or not available" }, { status: 404 })
    }

    const questionsWithoutAnswers = quiz.questions?.map((q: any, index: number) => ({
      index,
      question: q.question,
      type: q.type,
      options: q.options,
      points: q.points || 1
    })) || []

    return NextResponse.json({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      questionCount: questionsWithoutAnswers.length,
      questions: questionsWithoutAnswers
    })
  } catch (error) {
    console.error("Error fetching public quiz:", error)
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}
