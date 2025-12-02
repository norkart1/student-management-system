import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

interface DashboardSettingsInput {
  showStudentStats: boolean
  showTeacherStats: boolean
  showBookStats: boolean
  showWeeklyChart: boolean
  showActivityChart: boolean
  primaryColor: string
  accentColor: string
  schoolName: string
  schoolTagline: string
}

const defaultSettings: DashboardSettingsInput = {
  showStudentStats: true,
  showTeacherStats: true,
  showBookStats: true,
  showWeeklyChart: true,
  showActivityChart: true,
  primaryColor: "emerald",
  accentColor: "amber",
  schoolName: "Bright Future Academy",
  schoolTagline: "Private School"
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const settings = await db.collection("dashboardSettings").findOne({ active: true })
    
    if (!settings) {
      return NextResponse.json(defaultSettings)
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Failed to fetch dashboard settings:", error)
    return NextResponse.json(defaultSettings)
  }
}

export async function PUT(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: Partial<DashboardSettingsInput> = await request.json()

    const updateData = {
      showStudentStats: data.showStudentStats ?? true,
      showTeacherStats: data.showTeacherStats ?? true,
      showBookStats: data.showBookStats ?? true,
      showWeeklyChart: data.showWeeklyChart ?? true,
      showActivityChart: data.showActivityChart ?? true,
      primaryColor: data.primaryColor || "emerald",
      accentColor: data.accentColor || "amber",
      schoolName: data.schoolName?.trim() || "Bright Future Academy",
      schoolTagline: data.schoolTagline?.trim() || "Private School",
      active: true,
      updatedAt: new Date()
    }

    await db.collection("dashboardSettings").updateOne(
      { active: true },
      { 
        $set: updateData,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    )

    const settings = await db.collection("dashboardSettings").findOne({ active: true })
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Failed to update dashboard settings:", error)
    return NextResponse.json({ error: "Failed to update dashboard settings" }, { status: 500 })
  }
}
