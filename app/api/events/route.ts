import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const db = await getDatabase()
    const eventsCollection = db.collection("events")

    let query = {}
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month), 1)
      const endDate = new Date(parseInt(year), parseInt(month) + 1, 0, 23, 59, 59)
      query = {
        date: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString()
        }
      }
    }

    const events = await eventsCollection.find(query).toArray()
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, date, description, type } = body

    if (!title || !date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const eventsCollection = db.collection("events")

    const newEvent = {
      title,
      date,
      description: description || "",
      type: type || "general",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await eventsCollection.insertOne(newEvent)
    
    return NextResponse.json({
      ...newEvent,
      _id: result.insertedId
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
