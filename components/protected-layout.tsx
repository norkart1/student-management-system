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
    <div className="flex min-h-screen md:h-screen flex-col md:flex-row bg-gradient-to-br from-slate-50 via-white to-[#f0fdf4]">
      <Sidebar />
      <main className="flex-1 min-h-0 overflow-y-auto pb-20 md:pb-0 md:ml-0 flex flex-col">
        <div className="flex-1">{children}</div>
      </main>
      <BottomNav />
    </div>
  )
}
