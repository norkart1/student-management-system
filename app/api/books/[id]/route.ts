import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

interface BookUpdateInput {
  title?: string
  author?: string
  isbn?: string
  imageUrl?: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const book = await db.collection("books").findOne({
      _id: new ObjectId(id),
    })
    
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }
    
    return NextResponse.json(book)
  } catch (error) {
    console.error("Failed to fetch book:", error)
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const data: BookUpdateInput = await request.json()

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    
    if (data.title) updateData.title = data.title.trim()
    if (data.author) updateData.author = data.author.trim()
    if (data.isbn !== undefined) updateData.isbn = data.isbn?.trim() || null
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null

    const result = await db
      .collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update book:", error)
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("books").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete book:", error)
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
  }
}
