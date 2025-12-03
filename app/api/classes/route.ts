import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

interface ClassInput {
  name: string
  description?: string
  academicYear?: string
  section?: string
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const classes = await db.collection("classes")
      .aggregate([
        {
          $lookup: {
            from: "students",
            localField: "studentIds",
            foreignField: "_id",
            as: "students"
          }
        },
        {
          $lookup: {
            from: "teachers",
            localField: "teacherIds",
            foreignField: "_id",
            as: "teachers"
          }
        },
        {
          $lookup: {
            from: "books",
            localField: "bookIds",
            foreignField: "_id",
            as: "books"
          }
        },
        {
          $addFields: {
            studentCount: { $size: "$students" },
            teacherCount: { $size: "$teachers" },
            bookCount: { $size: { $ifNull: ["$books", []] } }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray()
    return NextResponse.json(classes)
  } catch (error) {
    console.error("Failed to fetch classes:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: ClassInput = await request.json()

    if (!data.name) {
      return NextResponse.json({ error: "Class name is required" }, { status: 400 })
    }

    const existingClass = await db.collection("classes").findOne({ 
      name: data.name.trim(),
      section: data.section || null
    })
    
    if (existingClass) {
      return NextResponse.json({ error: "A class with this name and section already exists" }, { status: 400 })
    }

    const newClass = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      academicYear: data.academicYear || new Date().getFullYear().toString(),
      section: data.section?.trim() || null,
      studentIds: [],
      teacherIds: [],
      bookIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("classes").insertOne(newClass)
    return NextResponse.json({ ...newClass, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create class:", error)
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
