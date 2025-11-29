import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"

interface EventUpdateInput {
  title?: string
  date?: string
  description?: string
  type?: string
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const db = await getDatabase()
    const eventsCollection = db.collection("events")

    const result = await eventsCollection.deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const body: EventUpdateInput = await request.json()
    const { title, date, description, type } = body

    if (date) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/
      if (!datePattern.test(date)) {
        return NextResponse.json(
          { error: "Date must be in YYYY-MM-DD format" },
          { status: 400 }
        )
      }
    }

    const db = await getDatabase()
    const eventsCollection = db.collection("events")

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString()
    }

    if (title !== undefined) updateData.title = title.trim()
    if (date !== undefined) updateData.date = date
    if (description !== undefined) updateData.description = description.trim()
    if (type !== undefined) updateData.type = type

    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Event updated successfully" })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}
