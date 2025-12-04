import { connectToDatabase } from "@/lib/db"
import { validateAuth, validateStudentAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminAuth = validateAuth(request)
  const studentAuth = validateStudentAuth(request)
  
  if (!adminAuth.valid && !studentAuth.valid) {
    return unauthorizedResponse("Unauthorized")
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const quiz = await db.collection("quizzes").findOne({ _id: new ObjectId(id) })
    
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    let className = null
    if (quiz.classId) {
      const classDoc = await db.collection("classes").findOne({ _id: new ObjectId(quiz.classId) })
      className = classDoc?.name || classDoc?.classNumber
    }

    const attemptCount = await db.collection("quizAttempts").countDocuments({ quizId: id })

    return NextResponse.json({
      ...quiz,
      className,
      attemptCount,
    })
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
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
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const existingQuiz = await db.collection("quizzes").findOne({ _id: new ObjectId(id) })
    if (!existingQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (data.title !== undefined) updateData.title = data.title.trim()
    if (data.description !== undefined) updateData.description = data.description.trim()
    if (data.classId !== undefined) updateData.classId = data.classId
    if (data.duration !== undefined) updateData.duration = Number(data.duration)
    if (data.passingScore !== undefined) updateData.passingScore = Number(data.passingScore)
    if (data.status !== undefined) updateData.status = data.status
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic
    if (data.instantFeedback !== undefined) updateData.instantFeedback = data.instantFeedback
    if (data.scheduledCloseTime !== undefined) {
      updateData.scheduledCloseTime = data.scheduledCloseTime ? new Date(data.scheduledCloseTime) : null
    }
    if (data.questions !== undefined) updateData.questions = data.questions

    await db.collection("quizzes").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    const isBeingActivated = data.status === "active" && existingQuiz.status !== "active"
    if (isBeingActivated) {
      const existingAnnouncement = await db.collection("announcements").findOne({ quizId: id })
      if (existingAnnouncement) {
        return NextResponse.json({ success: true, message: "Quiz updated successfully" })
      }

      const quizTitle = data.title?.trim() || existingQuiz.title
      const quizDescription = data.description?.trim() || existingQuiz.description || ""
      const isPublic = data.isPublic !== undefined ? data.isPublic : existingQuiz.isPublic

      const effectiveClassId = data.classId !== undefined ? data.classId : existingQuiz.classId
      let className = null
      if (effectiveClassId) {
        const classDoc = await db.collection("classes").findOne({ _id: new ObjectId(effectiveClassId) })
        className = classDoc?.name || classDoc?.classNumber
      }

      const announcement = {
        title: `New Quiz Available: ${quizTitle}`,
        content: quizDescription 
          ? `A new quiz "${quizTitle}" is now available${className ? ` for ${className}` : ""}. ${quizDescription}`
          : `A new quiz "${quizTitle}" is now available${className ? ` for ${className}` : ""}. Take it now!`,
        type: "exam" as const,
        pinned: false,
        active: true,
        targetRoles: isPublic ? ["student", "teacher", "all"] : ["student", "teacher"],
        quizId: id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.collection("announcements").insertOne(announcement)
    }

    return NextResponse.json({ success: true, message: "Quiz updated successfully" })
  } catch (error) {
    console.error("Error updating quiz:", error)
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 })
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
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    await db.collection("quizzes").deleteOne({ _id: new ObjectId(id) })
    await db.collection("quizAttempts").deleteMany({ quizId: id })

    return NextResponse.json({ success: true, message: "Quiz deleted successfully" })
  } catch (error) {
    console.error("Error deleting quiz:", error)
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 })
  }
}
