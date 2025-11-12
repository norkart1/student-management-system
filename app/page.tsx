"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const token = getAuthToken()
    if (token) {
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
  }, [mounted, router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center animate-pulse">
              <span className="text-4xl">📚</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Student Management System</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="text-center">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center animate-pulse">
            <span className="text-4xl">📚</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Student Management System</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
