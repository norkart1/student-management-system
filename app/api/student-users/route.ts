import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const query: any = {}
    if (status && status !== "all") {
      query.admissionStatus = status
    }

    const students = await db.collection("studentUsers")
      .find(query, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(students)
  } catch (error) {
    console.error("Failed to fetch student users:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
