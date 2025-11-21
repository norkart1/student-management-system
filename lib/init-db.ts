import { getDatabase } from "./db"

export async function initializeDatabase() {
  try {
    const db = await getDatabase()

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    if (!collectionNames.includes("students")) {
      await db.createCollection("students")
      await db.collection("students").createIndex({ email: 1 })
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

    console.log("[v0] Database initialization complete")
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
  }
}
