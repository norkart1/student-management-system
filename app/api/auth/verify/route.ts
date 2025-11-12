import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1]

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [username] = decoded.split(":")

    if (username === "admin") {
      return NextResponse.json({ authenticated: true, username })
    }
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}
