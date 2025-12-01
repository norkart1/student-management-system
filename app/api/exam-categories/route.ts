import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

interface ExamCategoryInput {
  name: string
  description?: string
  thumbnailUrl?: string
  status?: "draft" | "open" | "closed" | "scoring" | "published"
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
    
    const query: any = {}
    if (status) query.status = status

    const categories = await db.collection("examCategories")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    const enrichedCategories = await Promise.all(
      categories.map(async (category) => {
        const subjectCount = await db.collection("examSubjects").countDocuments({ categoryId: category._id.toString() })
        const applicationCount = await db.collection("examApplications").countDocuments({ categoryId: category._id.toString() })
        const approvedCount = await db.collection("examApplications").countDocuments({ 
          categoryId: category._id.toString(), 
          status: "approved" 
        })
        return {
          ...category,
          subjectCount,
          applicationCount,
          approvedCount,
          selectedStudents: category.selectedStudents || [],
        }
      })
    )

    return NextResponse.json(enrichedCategories)
  } catch (error) {
    console.error("Failed to fetch exam categories:", error)
    return NextResponse.json({ error: "Failed to fetch exam categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: ExamCategoryInput = await request.json()

    if (!data.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const category = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      thumbnailUrl: data.thumbnailUrl || null,
      status: data.status || "draft",
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("examCategories").insertOne(category)
    return NextResponse.json({ ...category, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create exam category:", error)
    return NextResponse.json({ error: "Failed to create exam category" }, { status: 500 })
  }
}
