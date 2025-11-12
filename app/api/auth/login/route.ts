import { validateAdminLogin } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (validateAdminLogin(username, password)) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString("base64")
      return NextResponse.json({ token, success: true })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
