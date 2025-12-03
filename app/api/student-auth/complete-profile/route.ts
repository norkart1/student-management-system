import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

interface ProfileData {
  dateOfBirth: string
  gender: string
  applyingForClass: string
  parentName: string
  parentPhone: string
  parentEmail: string
  address: string
  previousSchool?: string
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    let decoded: any

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret")
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    if (decoded.role !== "student") {
      return NextResponse.json({ error: "Invalid token type" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const data: ProfileData = await request.json()

    if (!data.dateOfBirth || !data.gender || !data.applyingForClass || 
        !data.parentName || !data.parentPhone || !data.parentEmail || !data.address) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      )
    }

    if (!data.applyingForClass || data.applyingForClass.length === 0) {
      return NextResponse.json(
        { error: "Invalid class selection" },
        { status: 400 }
      )
    }

    const settings = await db.collection("admissionSettings").findOne({ active: true })
    
    if (!settings || !settings.isOpen) {
      return NextResponse.json(
        { error: "Admissions are currently closed" },
        { status: 400 }
      )
    }

    if (!settings.openClasses.includes(data.applyingForClass)) {
      return NextResponse.json(
        { error: "This class is not open for admission" },
        { status: 400 }
      )
    }

    const studentId = new ObjectId(decoded.studentId)
    
    // Get the student to check if they already have an application
    const existingStudent = await db.collection("studentUsers").findOne({ _id: studentId })
    
    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if an application already exists for this student
    const existingApplication = await db.collection("admissionApplications").findOne({
      studentUserId: studentId
    })

    if (existingApplication) {
      return NextResponse.json({ 
        error: "You have already submitted an admission application" 
      }, { status: 400 })
    }
    
    const updateResult = await db.collection("studentUsers").findOneAndUpdate(
      { _id: studentId },
      {
        $set: {
          profileCompleted: true,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          applyingForClass: data.applyingForClass,
          parentName: data.parentName.trim(),
          parentPhone: data.parentPhone.trim(),
          parentEmail: data.parentEmail.trim().toLowerCase(),
          address: data.address.trim(),
          previousSchool: data.previousSchool?.trim() || null,
          updatedAt: new Date()
        }
      },
      { returnDocument: "after" }
    )

    if (!updateResult) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const student = updateResult

    // Create an admission application record
    const applicationNumber = `ADM${Date.now().toString().slice(-8)}`
    
    const admissionApplication = {
      applicationNumber,
      studentUserId: studentId,
      studentName: student.fullName,
      email: student.email,
      phone: student.phone,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      applyingForClass: data.applyingForClass,
      parentName: data.parentName.trim(),
      parentPhone: data.parentPhone.trim(),
      parentEmail: data.parentEmail.trim().toLowerCase(),
      address: data.address.trim(),
      previousSchool: data.previousSchool?.trim() || null,
      photoUrl: student.imageUrl || null,
      academicYear: settings.academicYear,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("admissionApplications").insertOne(admissionApplication)

    // Update the studentUser with the application number
    await db.collection("studentUsers").updateOne(
      { _id: studentId },
      { $set: { applicationNumber } }
    )
    
    return NextResponse.json({
      success: true,
      message: `Application submitted successfully! Your application number is ${applicationNumber}. Please wait for admission approval.`,
      applicationNumber,
      student: {
        id: student._id.toString(),
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        imageUrl: student.imageUrl,
        profileCompleted: student.profileCompleted,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        applyingForClass: student.applyingForClass,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        parentEmail: student.parentEmail,
        address: student.address,
        previousSchool: student.previousSchool,
        admissionStatus: student.admissionStatus,
        approvedClass: student.approvedClass
      }
    })

  } catch (error) {
    console.error("Complete profile error:", error)
    return NextResponse.json(
      { error: "Failed to complete profile. Please try again." },
      { status: 500 }
    )
  }
}
