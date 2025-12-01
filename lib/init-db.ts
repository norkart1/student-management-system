import { getDatabase } from "./db"

export async function initializeDatabase() {
  try {
    const db = await getDatabase()

    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c: { name: string }) => c.name)

    if (!collectionNames.includes("students")) {
      await db.createCollection("students")
      await db.collection("students").createIndex({ email: 1 }, { unique: true })
      await db.collection("students").createIndex({ registrationNumber: 1 }, { unique: true, sparse: true })
      console.log("[v0] Created students collection")
    }

    if (!collectionNames.includes("teachers")) {
      await db.createCollection("teachers")
      await db.collection("teachers").createIndex({ email: 1 })
      console.log("[v0] Created teachers collection")
    }

    if (!collectionNames.includes("books")) {
      await db.createCollection("books")
      await db.collection("books").createIndex({ isbn: 1 })
      console.log("[v0] Created books collection")
    }

    if (!collectionNames.includes("examCategories")) {
      await db.createCollection("examCategories")
      await db.collection("examCategories").createIndex({ name: 1 })
      console.log("[v0] Created examCategories collection")
    }

    if (!collectionNames.includes("examSubjects")) {
      await db.createCollection("examSubjects")
      await db.collection("examSubjects").createIndex({ categoryId: 1 })
      console.log("[v0] Created examSubjects collection")
    }

    if (!collectionNames.includes("examApplications")) {
      await db.createCollection("examApplications")
      await db.collection("examApplications").createIndex({ categoryId: 1, studentId: 1 }, { unique: true })
      await db.collection("examApplications").createIndex({ status: 1 })
      console.log("[v0] Created examApplications collection")
    }

    if (!collectionNames.includes("examResults")) {
      await db.createCollection("examResults")
      await db.collection("examResults").createIndex({ categoryId: 1, studentId: 1 })
      await db.collection("examResults").createIndex({ categoryId: 1, subjectId: 1, studentId: 1 }, { unique: true })
      console.log("[v0] Created examResults collection")
    }

    console.log("[v0] Database initialization complete")
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
  }
}
