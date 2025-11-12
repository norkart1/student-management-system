import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const leaves = await db.collection("leaves").find({}).toArray()
    return NextResponse.json(leaves)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leave records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const data = await request.json()

    const leave = {
      ...data,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("leaves").insertOne(leave)
    return NextResponse.json({ ...leave, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create leave record" }, { status: 500 })
  }
}
