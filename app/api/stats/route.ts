import { connectToDatabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const [studentsCount, teachersCount, booksCount] = await Promise.all([
      db.collection("students").countDocuments(),
      db.collection("teachers").countDocuments(),
      db.collection("books").countDocuments(),
    ])

    const now = new Date()
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    
    const weeklyData: { day: string; date: string; students: number; teachers: number; books: number }[] = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      
      const [studentsOnDay, teachersOnDay, booksOnDay] = await Promise.all([
        db.collection("students").countDocuments({
          createdAt: { $gte: startOfDay, $lt: endOfDay }
        }),
        db.collection("teachers").countDocuments({
          createdAt: { $gte: startOfDay, $lt: endOfDay }
        }),
        db.collection("books").countDocuments({
          createdAt: { $gte: startOfDay, $lt: endOfDay }
        })
      ])
      
      weeklyData.push({
        day: dayNames[date.getDay()],
        date: date.toISOString().split('T')[0],
        students: studentsOnDay,
        teachers: teachersOnDay,
        books: booksOnDay
      })
    }

    const activityData = weeklyData.map(item => ({
      day: item.day,
      date: item.date,
      activity: item.students + item.teachers + item.books
    }))

    const totalActivity = activityData.reduce((sum, item) => sum + item.activity, 0)
    const avgActivity = activityData.length > 0 ? Math.round(totalActivity / activityData.length) : 0

    return NextResponse.json({
      students: studentsCount,
      teachers: teachersCount,
      books: booksCount,
      weekly: weeklyData,
      activity: activityData,
      avgActivity: avgActivity
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
