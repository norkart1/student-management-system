import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
    }

    const category = await db.collection("examCategories").findOne({ _id: new ObjectId(id) })
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const subjects = await db.collection("examSubjects")
      .find({ categoryId: id })
      .sort({ order: 1 })
      .toArray()

    const applications = await db.collection("examApplications")
      .find({ categoryId: id })
      .toArray()

    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const student = await db.collection("students").findOne({ _id: new ObjectId(app.studentId) })
        return {
          ...app,
          studentName: student?.fullName || "Unknown",
          studentEmail: student?.email || "",
          registrationNumber: student?.registrationNumber || "",
        }
      })
    )

    const selectedStudentIds = category.selectedStudents || []
    let selectedStudentsData: any[] = []
    if (selectedStudentIds.length > 0) {
      const studentDocs = await db.collection("students")
        .find({ _id: { $in: selectedStudentIds.map((id: string) => new ObjectId(id)) } })
        .toArray()
      selectedStudentsData = studentDocs.map(s => ({
        _id: s._id.toString(),
        studentId: s._id.toString(),
        studentName: s.name || s.fullName,
        registrationNumber: s.registrationNumber,
        studentImage: s.imageUrl,
      }))
    }

    return NextResponse.json({
      ...category,
      subjects,
      applications: enrichedApplications,
      selectedStudentsData,
    })
  } catch (error) {
    console.error("Failed to fetch exam category:", error)
    return NextResponse.json({ error: "Failed to fetch exam category" }, { status: 500 })
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
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (data.name) updateData.name = data.name.trim()
    if (data.description !== undefined) updateData.description = data.description.trim()
    if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl
    if (data.selectedStudents !== undefined) updateData.selectedStudents = data.selectedStudents
    
    if (data.status) {
      const category = await db.collection("examCategories").findOne({ _id: new ObjectId(id) })
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }

      const validTransitions: Record<string, string[]> = {
        draft: ["scoring"],
        open: ["scoring"],
        closed: ["scoring"],
        scoring: ["published", "draft"],
        published: [],
      }

      if (!validTransitions[category.status]?.includes(data.status)) {
        return NextResponse.json({ 
          error: `Cannot transition from '${category.status}' to '${data.status}'` 
        }, { status: 400 })
      }

      if (data.status === "scoring") {
        const subjectCount = await db.collection("examSubjects").countDocuments({ categoryId: id })
        if (subjectCount === 0) {
          return NextResponse.json({ 
            error: "Cannot start scoring: Add at least one subject first" 
          }, { status: 400 })
        }
      }

      if (data.status === "published") {
        const selectedStudents = category.selectedStudents || []
        if (selectedStudents.length === 0) {
          return NextResponse.json({ 
            error: "Cannot publish: No students selected for this exam" 
          }, { status: 400 })
        }

        const subjects = await db.collection("examSubjects").find({ categoryId: id }).toArray()
        const subjectIds = new Set(subjects.map(s => s._id.toString()))

        for (const studentId of selectedStudents) {
          const studentResults = await db.collection("examResults")
            .find({
              categoryId: id,
              studentId: studentId,
            })
            .toArray()

          const coveredSubjectIds = new Set(studentResults.map(r => r.subjectId))
          
          for (const subjectId of subjectIds) {
            if (!coveredSubjectIds.has(subjectId)) {
              const student = await db.collection("students").findOne({ _id: new ObjectId(studentId) })
              const missingSubject = subjects.find(s => s._id.toString() === subjectId)
              return NextResponse.json({ 
                error: `Cannot publish: ${student?.name || student?.fullName || 'A student'} is missing score for ${missingSubject?.name || 'a subject'}` 
              }, { status: 400 })
            }
          }
        }
      }

      updateData.status = data.status
      if (data.status === "published") {
        updateData.publishedAt = new Date()
      }
    }

    const result = await db.collection("examCategories").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    )

    if (!result) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to update exam category:", error)
    return NextResponse.json({ error: "Failed to update exam category" }, { status: 500 })
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
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
    }

    await db.collection("examSubjects").deleteMany({ categoryId: id })
    await db.collection("examApplications").deleteMany({ categoryId: id })
    await db.collection("examResults").deleteMany({ categoryId: id })

    const result = await db.collection("examCategories").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete exam category:", error)
    return NextResponse.json({ error: "Failed to delete exam category" }, { status: 500 })
  }
}
