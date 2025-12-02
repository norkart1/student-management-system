import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"

interface ApplicationInput {
  studentName: string
  dateOfBirth: string
  gender: string
  applyingForClass: number
  parentName: string
  parentPhone: string
  parentEmail: string
  address: string
  previousSchool?: string
}

export async function GET(request: NextRequest) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const classNum = searchParams.get("class")
    
    const query: any = {}
    if (status) query.status = status
    if (classNum) query.applyingForClass = parseInt(classNum)

    const applications = await db.collection("admissionApplications")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Failed to fetch applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const data: ApplicationInput = await request.json()

    const settings = await db.collection("admissionSettings").findOne({ active: true })
    
    if (!settings || !settings.isOpen) {
      return NextResponse.json({ error: "Admissions are currently closed" }, { status: 400 })
    }

    if (!settings.openClasses.includes(data.applyingForClass)) {
      return NextResponse.json({ error: "This class is not open for admission" }, { status: 400 })
    }

    if (!data.studentName || !data.dateOfBirth || !data.gender || 
        !data.applyingForClass || !data.parentName || !data.parentPhone || 
        !data.parentEmail || !data.address) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    const applicationNumber = `ADM${Date.now().toString().slice(-8)}`

    const application = {
      applicationNumber,
      studentName: data.studentName.trim(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      applyingForClass: data.applyingForClass,
      parentName: data.parentName.trim(),
      parentPhone: data.parentPhone.trim(),
      parentEmail: data.parentEmail.trim().toLowerCase(),
      address: data.address.trim(),
      previousSchool: data.previousSchool?.trim() || null,
      academicYear: settings.academicYear,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("admissionApplications").insertOne(application)
    return NextResponse.json({ 
      ...application, 
      _id: result.insertedId,
      message: `Application submitted successfully! Your application number is ${applicationNumber}`
    }, { status: 201 })
  } catch (error) {
    console.error("Failed to submit application:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
