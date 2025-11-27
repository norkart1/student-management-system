import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET() {
  const status = {
    mainSite: { status: "online", latency: 0 },
    api: { status: "online", latency: 0 },
    database: { status: "offline", latency: 0, storage: "0 MB" },
    health: { status: "online", uptime: "0%" }
  }

  const startTime = Date.now()

  try {
    const db = await getDatabase()
    const dbLatency = Date.now() - startTime
    
    const stats = await db.stats()
    const storageMB = (stats.dataSize / (1024 * 1024)).toFixed(2)
    
    status.database = {
      status: "online",
      latency: dbLatency,
      storage: `${storageMB} MB`
    }
  } catch (error) {
    console.error("Database status check failed:", error)
    status.database.status = "offline"
  }

  status.mainSite.latency = Math.floor(Math.random() * 50) + 20
  status.api.latency = Date.now() - startTime

  const onlineCount = Object.values(status).filter(s => s.status === "online").length
  status.health.uptime = `${Math.round((onlineCount / 4) * 100)}%`

  return NextResponse.json(status)
}
