import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

interface AdmissionSettingsInput {
  isOpen: boolean
  academicYear: string
  openClasses: number[]
  startDate?: string
  endDate?: string
  description?: string
  requirements?: string
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    let settings = await db.collection("admissionSettings").findOne({ active: true })
    
    if (!settings) {
      settings = {
        isOpen: false,
        academicYear: new Date().getFullYear().toString(),
        openClasses: [],
        description: "",
        requirements: "",
        startDate: null,
        endDate: null,
        active: true
      }
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Failed to fetch admission settings:", error)
    return NextResponse.json({ error: "Failed to fetch admission settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const data: AdmissionSettingsInput = await request.json()

    const updateData = {
      isOpen: data.isOpen ?? false,
      academicYear: data.academicYear || new Date().getFullYear().toString(),
      openClasses: data.openClasses || [],
      description: data.description?.trim() || "",
      requirements: data.requirements?.trim() || "",
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      active: true,
      updatedAt: new Date()
    }

    await db.collection("admissionSettings").updateOne(
      { active: true },
      { 
        $set: updateData,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    )

    const settings = await db.collection("admissionSettings").findOne({ active: true })
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Failed to update admission settings:", error)
    return NextResponse.json({ error: "Failed to update admission settings" }, { status: 500 })
  }
}
