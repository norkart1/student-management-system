import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role") || "all"
    const limit = parseInt(searchParams.get("limit") || "10")
    const unreadOnly = searchParams.get("unread") === "true"

    const query: any = { active: true }
    
    if (role !== "all") {
      query.$or = [
        { targetRoles: { $exists: false } },
        { targetRoles: { $size: 0 } },
        { targetRoles: role },
        { targetRoles: "all" }
      ]
    }

    const announcements = await db.collection("announcements")
      .find(query)
      .sort({ pinned: -1, createdAt: -1 })
      .limit(limit)
      .toArray()

    const notifications = announcements.map(ann => ({
      _id: ann._id,
      title: ann.title,
      content: ann.content,
      type: ann.type || "general",
      pinned: ann.pinned || false,
      createdAt: ann.createdAt,
      isNew: isWithinHours(ann.createdAt, 24)
    }))

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

function isWithinHours(date: Date, hours: number): boolean {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  return diff < hours * 60 * 60 * 1000
}
