import { connectToDatabase } from "@/lib/db"
import { validateAuth, unauthorizedResponse } from "@/lib/auth-middleware"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId, Db } from "mongodb"

async function generateRegistrationNumber(db: Db): Promise<string> {
  const lastStudent = await db.collection("students")
    .find({ registrationNumber: { $regex: `^\\d{5}$` } })
    .sort({ registrationNumber: -1 })
    .limit(1)
    .toArray()
  
  let nextNumber = 10001
  if (lastStudent.length > 0 && lastStudent[0].registrationNumber) {
    const lastNum = parseInt(lastStudent[0].registrationNumber)
    if (!isNaN(lastNum)) {
      nextNumber = lastNum + 1
    }
  }
  
  return nextNumber.toString().padStart(5, '0')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateAuth(request)
  if (!auth.valid) {
    return unauthorizedResponse(auth.error)
  }

  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    const application = await db.collection("admissionApplications").findOne({ 
      _id: new ObjectId(id) 
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Failed to fetch application:", error)
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 })
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
    const { db } = await connectToDatabase()
    const data = await request.json()

    // First get the current application to check status change
    const currentApplication = await db.collection("admissionApplications").findOne({ 
      _id: new ObjectId(id) 
    })

    if (!currentApplication) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: new Date()
    }

    if (data.status) updateData.status = data.status
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.reviewedBy) updateData.reviewedBy = data.reviewedBy
    if (data.reviewedAt) updateData.reviewedAt = new Date()

    const result = await db.collection("admissionApplications").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // If status changed to approved, create a student record
    if (data.status === "approved" && currentApplication.status !== "approved") {
      const registrationNumber = await generateRegistrationNumber(db)
      
      const student = {
        fullName: currentApplication.studentName,
        email: currentApplication.parentEmail || "",
        phone: currentApplication.parentPhone || "",
        dateOfBirth: currentApplication.dateOfBirth,
        registrationNumber: registrationNumber,
        class: currentApplication.applyingForClass,
        parentName: currentApplication.parentName,
        address: currentApplication.address,
        gender: currentApplication.gender,
        previousSchool: currentApplication.previousSchool,
        admissionApplicationId: currentApplication._id,
        academicYear: currentApplication.academicYear,
        imageUrl: currentApplication.photoUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.collection("students").insertOne(student)

      // Update the application with the student registration number
      await db.collection("admissionApplications").updateOne(
        { _id: new ObjectId(id) },
        { $set: { studentRegistrationNumber: registrationNumber } }
      )
    }

    const updatedApplication = await db.collection("admissionApplications").findOne({ 
      _id: new ObjectId(id) 
    })
    
    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error("Failed to update application:", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
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
    const { db } = await connectToDatabase()
    
    const result = await db.collection("admissionApplications").deleteOne({ 
      _id: new ObjectId(id) 
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Application deleted successfully" })
  } catch (error) {
    console.error("Failed to delete application:", error)
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 })
  }
}
