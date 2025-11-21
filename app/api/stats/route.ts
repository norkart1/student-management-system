import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const [studentsCount, teachersCount, booksCount] = await Promise.all([
      db.collection("students").countDocuments(),
      db.collection("teachers").countDocuments(),
      db.collection("books").countDocuments(),
    ])

    return NextResponse.json({
      students: studentsCount,
      teachers: teachersCount,
      books: booksCount,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
