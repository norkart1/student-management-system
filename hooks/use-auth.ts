"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/auth"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const verifyAuth = async () => {
      const token = getAuthToken()

      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        router.push("/login")
        return
      }

      try {
        const response = await fetch("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push("/login")
        }
      } catch {
        setIsAuthenticated(false)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [mounted, router])

  return { isAuthenticated, loading }
}
