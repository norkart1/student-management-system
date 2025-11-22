import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')
    const yearParam = searchParams.get('year')

    if (monthParam === null || yearParam === null) {
      return NextResponse.json(
        { error: "Both month and year are required" },
        { status: 400 }
      )
    }

    const month = parseInt(monthParam)
    const year = parseInt(yearParam)
    
    if (isNaN(month) || isNaN(year) || month < 0 || month > 11 || year < 1900 || year > 2100) {
      return NextResponse.json({ error: "Invalid month or year" }, { status: 400 })
    }

    const db = await getDatabase()
    const eventsCollection = db.collection("events")

    const paddedMonth = String(month + 1).padStart(2, '0')
    const startDate = `${year}-${paddedMonth}-01`
    
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const endDate = `${year}-${paddedMonth}-${String(daysInMonth).padStart(2, '0')}`
    
    const query = {
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }

    const events = await eventsCollection.find(query).toArray()
    const eventsWithStringIds = events.map(event => ({
      ...event,
      _id: event._id.toString()
    }))
    return NextResponse.json(eventsWithStringIds)
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

    const datePattern = /^\d{4}-\d{2}-\d{2}$/
    if (!datePattern.test(date)) {
      return NextResponse.json(
        { error: "Date must be in YYYY-MM-DD format" },
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
      _id: result.insertedId.toString()
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
