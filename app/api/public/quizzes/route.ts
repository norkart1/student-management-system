import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    
    const quizzes = await db.collection("quizzes")
      .find({ 
        isPublic: true, 
        status: "active" 
      })
      .project({
        title: 1,
        description: 1,
        duration: 1,
        passingScore: 1,
        createdAt: 1,
        questions: 1
      })
      .sort({ createdAt: -1 })
      .toArray()

    const enrichedQuizzes = quizzes.map(quiz => ({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      createdAt: quiz.createdAt,
      questionCount: quiz.questions?.length || 0
    }))

    return NextResponse.json(enrichedQuizzes)
  } catch (error) {
    console.error("Error fetching public quizzes:", error)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}
