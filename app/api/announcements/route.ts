import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

interface AnnouncementInput {
  title: string
  content: string
  type?: "general" | "exam" | "event" | "urgent"
  pinned?: boolean
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const type = searchParams.get("type")
    const pinnedOnly = searchParams.get("pinned") === "true"
    
    const query: any = { active: true }
    if (type) query.type = type
    if (pinnedOnly) query.pinned = true

    const announcements = await db.collection("announcements")
      .find(query)
      .sort({ pinned: -1, createdAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json(announcements)
  } catch (error) {
    console.error("Failed to fetch announcements:", error)
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: AnnouncementInput = await request.json()

    if (!data.title || !data.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const announcement = {
      title: data.title.trim(),
      content: data.content.trim(),
      type: data.type || "general",
      pinned: data.pinned || false,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("announcements").insertOne(announcement)
    return NextResponse.json({ ...announcement, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create announcement:", error)
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
  }
}
