import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const registrationNumber = searchParams.get("registrationNumber")
    const dateOfBirth = searchParams.get("dateOfBirth")
    const categoryId = searchParams.get("categoryId")

    if (!registrationNumber && !categoryId) {
      const publishedCategories = await db.collection("examCategories")
        .find({ status: "published" })
        .sort({ publishedAt: -1 })
        .limit(10)
        .toArray()

      const enrichedCategories = await Promise.all(
        publishedCategories.map(async (category) => {
          const subjectCount = await db.collection("examSubjects").countDocuments({ categoryId: category._id.toString() })
          const resultCount = await db.collection("examResults").countDocuments({ categoryId: category._id.toString() })
          return {
            _id: category._id,
            name: category.name,
            description: category.description,
            thumbnailUrl: category.thumbnailUrl,
            publishedAt: category.publishedAt,
            subjectCount,
            resultCount,
          }
        })
      )

      return NextResponse.json({ 
        type: "categories",
        data: enrichedCategories 
      })
    }

    if (registrationNumber) {
      if (!dateOfBirth) {
        return NextResponse.json({ 
          error: "Date of birth is required" 
        }, { status: 400 })
      }

      const student = await db.collection("students").findOne({ 
        registrationNumber: registrationNumber.toUpperCase(),
        dateOfBirth: dateOfBirth
      })

      if (!student) {
        return NextResponse.json({ 
          error: "No student found with this registration number and date of birth" 
        }, { status: 404 })
      }

      const publishedCategories = await db.collection("examCategories")
        .find({ status: "published" })
        .toArray()

      if (publishedCategories.length === 0) {
        return NextResponse.json({
          type: "results",
          student: {
            fullName: student.fullName,
            registrationNumber: student.registrationNumber,
            imageUrl: student.imageUrl,
          },
          data: [],
        })
      }

      const publishedCategoryIds = publishedCategories.map(c => c._id.toString())
      
      let filteredCategoryIds = publishedCategoryIds
      if (categoryId) {
        if (!ObjectId.isValid(categoryId)) {
          return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
        }
        if (!publishedCategoryIds.includes(categoryId)) {
          return NextResponse.json({
            type: "results",
            student: {
              fullName: student.fullName,
              registrationNumber: student.registrationNumber,
              imageUrl: student.imageUrl,
            },
            data: [],
          })
        }
        filteredCategoryIds = [categoryId]
      }

      const results = await db.collection("examResults")
        .find({ 
          studentId: student._id.toString(),
          categoryId: { $in: filteredCategoryIds }
        })
        .toArray()

      if (results.length === 0) {
        return NextResponse.json({
          type: "results",
          student: {
            fullName: student.fullName,
            registrationNumber: student.registrationNumber,
            imageUrl: student.imageUrl,
          },
          data: [],
        })
      }

      const enrichedResults = await Promise.all(
        results.map(async (result) => {
          const category = publishedCategories.find(c => c._id.toString() === result.categoryId)
          const subject = await db.collection("examSubjects").findOne({ _id: new ObjectId(result.subjectId) })
          
          return {
            categoryId: result.categoryId,
            categoryName: category?.name || "Unknown",
            subjectId: result.subjectId,
            subjectName: subject?.name || "Unknown",
            maxScore: subject?.maxScore || 0,
            score: result.score,
            publishedAt: category?.publishedAt,
          }
        })
      )

      const groupedResults = enrichedResults.reduce((acc: any, result) => {
        if (!acc[result.categoryId]) {
          acc[result.categoryId] = {
            categoryId: result.categoryId,
            categoryName: result.categoryName,
            publishedAt: result.publishedAt,
            subjects: [],
            totalScore: 0,
            totalMaxScore: 0,
          }
        }
        acc[result.categoryId].subjects.push({
          subjectId: result.subjectId,
          subjectName: result.subjectName,
          maxScore: result.maxScore,
          score: result.score,
        })
        acc[result.categoryId].totalScore += result.score
        acc[result.categoryId].totalMaxScore += result.maxScore
        return acc
      }, {})

      return NextResponse.json({
        type: "results",
        student: {
          fullName: student.fullName,
          registrationNumber: student.registrationNumber,
          imageUrl: student.imageUrl,
        },
        data: Object.values(groupedResults),
      })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Failed to fetch public results:", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}
