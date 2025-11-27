import { validateAdminCredentials } from "@/lib/admin"
import { signToken } from "@/lib/jwt"
import { connectToDatabase } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

function parseUserAgent(userAgent: string): { deviceName: string; deviceType: string; browser: string } {
  let deviceName = "Unknown Device"
  let deviceType = "desktop"
  let browser = "Unknown Browser"

  if (userAgent.includes("iPhone")) {
    const match = userAgent.match(/iPhone\s*([\d,]+)?/)
    deviceName = match ? `iPhone ${match[1] || ""}`.trim() : "iPhone"
    deviceType = "mobile"
  } else if (userAgent.includes("iPad")) {
    deviceName = "iPad"
    deviceType = "tablet"
  } else if (userAgent.includes("Android")) {
    if (userAgent.includes("SM-S91")) {
      deviceName = "Samsung Galaxy S23"
    } else if (userAgent.includes("SM-")) {
      const match = userAgent.match(/SM-([A-Z0-9]+)/)
      deviceName = match ? `Samsung ${match[1]}` : "Samsung Device"
    } else if (userAgent.includes("Pixel")) {
      const match = userAgent.match(/Pixel\s*(\d+)?/)
      deviceName = match ? `Google Pixel ${match[1] || ""}`.trim() : "Google Pixel"
    } else {
      deviceName = "Android Device"
    }
    deviceType = userAgent.includes("Mobile") ? "mobile" : "tablet"
  } else if (userAgent.includes("Windows")) {
    deviceName = "Windows PC"
    deviceType = "desktop"
  } else if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS")) {
    deviceName = "MacBook"
    deviceType = "desktop"
  } else if (userAgent.includes("Linux")) {
    deviceName = "Linux PC"
    deviceType = "desktop"
  }

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome"
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari"
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox"
  } else if (userAgent.includes("Edg")) {
    browser = "Edge"
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    browser = "Opera"
  }

  return { deviceName, deviceType, browser }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    const userAgent = request.headers.get("user-agent") || ""

    const admin = await validateAdminCredentials(username, password)
    
    if (admin) {
      const token = signToken({
        adminId: admin.id,
        username: admin.username
      })

      const { deviceName, deviceType, browser } = parseUserAgent(userAgent)

      try {
        const { db } = await connectToDatabase()
        
        const existingDevice = await db.collection("devices").findOne({
          adminId: admin.id,
          userAgent: userAgent
        })

        if (existingDevice) {
          await db.collection("devices").updateOne(
            { _id: existingDevice._id },
            { 
              $set: { 
                lastActive: new Date(),
                loginCount: (existingDevice.loginCount || 1) + 1
              } 
            }
          )
        } else {
          await db.collection("devices").insertOne({
            adminId: admin.id,
            deviceName,
            deviceType,
            browser,
            userAgent,
            ipAddress: request.headers.get("x-forwarded-for") || "Unknown",
            firstLogin: new Date(),
            lastActive: new Date(),
            loginCount: 1
          })
        }
      } catch (deviceError) {
        console.error("Error saving device info:", deviceError)
      }
      
      return NextResponse.json({ 
        token, 
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          profileImage: admin.profileImage
        }
      })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
