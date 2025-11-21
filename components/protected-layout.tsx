"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Spinner } from "@/components/spinner"
import { BottomNav } from "@/components/bottom-nav"
import { Footer } from "@/components/footer"

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        <div className="min-h-full flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
