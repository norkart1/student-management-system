"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Spinner } from "@/components/spinner"
import { BottomNav } from "@/components/bottom-nav"

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#CFF4D2] via-white to-[#CFF4D2]">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#CFF4D2]/30 via-white to-[#7BE495]/20">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
