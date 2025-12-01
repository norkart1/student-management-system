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

    return NextResponse.json({
      ...category,
      subjects,
      applications: enrichedApplications,
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
    
    if (data.status) {
      const category = await db.collection("examCategories").findOne({ _id: new ObjectId(id) })
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }

      const validTransitions: Record<string, string[]> = {
        draft: ["open"],
        open: ["closed", "draft"],
        closed: ["scoring", "open"],
        scoring: ["published", "closed"],
        published: [],
      }

      if (!validTransitions[category.status]?.includes(data.status)) {
        return NextResponse.json({ 
          error: `Cannot transition from '${category.status}' to '${data.status}'` 
        }, { status: 400 })
      }

      if (data.status === "open") {
        const subjectCount = await db.collection("examSubjects").countDocuments({ categoryId: id })
        if (subjectCount === 0) {
          return NextResponse.json({ 
            error: "Cannot open applications: Add at least one subject first" 
          }, { status: 400 })
        }
      }

      if (data.status === "published") {
        const approvedCount = await db.collection("examApplications").countDocuments({ 
          categoryId: id, 
          status: "approved" 
        })
        if (approvedCount === 0) {
          return NextResponse.json({ 
            error: "Cannot publish: No approved students" 
          }, { status: 400 })
        }

        const subjects = await db.collection("examSubjects").find({ categoryId: id }).toArray()
        const subjectIds = new Set(subjects.map(s => s._id.toString()))
        
        const approvedApps = await db.collection("examApplications")
          .find({ categoryId: id, status: "approved" })
          .toArray()

        for (const app of approvedApps) {
          const studentResults = await db.collection("examResults")
            .find({
              categoryId: id,
              studentId: app.studentId,
            })
            .toArray()

          const coveredSubjectIds = new Set(studentResults.map(r => r.subjectId))
          
          for (const subjectId of subjectIds) {
            if (!coveredSubjectIds.has(subjectId)) {
              const student = await db.collection("students").findOne({ _id: new ObjectId(app.studentId) })
              const missingSubject = subjects.find(s => s._id.toString() === subjectId)
              return NextResponse.json({ 
                error: `Cannot publish: ${student?.fullName || 'A student'} is missing score for ${missingSubject?.name || 'a subject'}` 
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
