import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const teachers = await db.collection("teachers").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(teachers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    const teacher = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("teachers").insertOne(teacher)
    return NextResponse.json({ ...teacher, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 })
  }
}
