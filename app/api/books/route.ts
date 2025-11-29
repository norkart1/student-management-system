import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

interface BookInput {
  title: string
  author: string
  isbn?: string
  imageUrl?: string
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const books = await db.collection("books").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(books)
  } catch (error) {
    console.error("Failed to fetch books:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: BookInput = await request.json()

    if (!data.title || !data.author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const book = {
      title: data.title.trim(),
      author: data.author.trim(),
      isbn: data.isbn?.trim() || null,
      imageUrl: data.imageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("books").insertOne(book)
    return NextResponse.json({ ...book, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create book:", error)
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
  }
}
