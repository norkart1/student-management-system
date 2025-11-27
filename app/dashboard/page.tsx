"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp } from "lucide-react"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    students: number | null
    teachers: number | null
    books: number | null
  }>({
    students: null,
    teachers: null,
    books: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats")
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`)
      }

      const data = await response.json()

      if (
        typeof data.students !== 'number' ||
        typeof data.teachers !== 'number' ||
        typeof data.books !== 'number'
      ) {
        throw new Error('Invalid stats data format')
      }

      setStats({
        students: data.students,
        teachers: data.teachers,
        books: data.books,
      })
      setError(false)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setStats({
        students: null,
        teachers: null,
        books: null,
      })
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const quickStats = [
    { 
      label: "Total Students", 
      value: loading ? "..." : (stats.students === null ? "N/A" : stats.students.toLocaleString()), 
      icon: Users, 
      progress: 75
    },
    { 
      label: "Active Teachers", 
      value: loading ? "..." : (stats.teachers === null ? "N/A" : stats.teachers.toLocaleString()), 
      icon: GraduationCap, 
      progress: 60
    },
  ]

  const modules = [
    { 
      name: "Students", 
      href: "/dashboard/students", 
      icon: Users, 
      desc: "Manage students",
      count: loading ? "..." : (stats.students === null ? "N/A" : stats.students.toLocaleString())
    },
    { 
      name: "Teachers", 
      href: "/dashboard/teachers", 
      icon: GraduationCap, 
      desc: "Manage teachers",
      count: loading ? "..." : (stats.teachers === null ? "N/A" : stats.teachers.toLocaleString())
    },
    { 
      name: "Books", 
      href: "/dashboard/books", 
      icon: BookOpen, 
      desc: "Library management",
      count: loading ? "..." : (stats.books === null ? "N/A" : stats.books.toLocaleString())
    },
    { 
      name: "Calendar", 
      href: "/dashboard/calendar", 
      icon: Calendar, 
      desc: "View events",
      count: "Events"
    },
  ]

  return (
    <ProtectedLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          <div className="bg-gradient-to-br from-[#205072] via-[#329D9C] to-[#56C596] rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-[#329D9C]/30">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Hi! Admin</h1>
                <p className="text-white/90 text-sm md:text-base">Welcome to your management dashboard</p>
              </div>
              <ProfileDropdown />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-5 shadow-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-[#205072]/70 text-xs md:text-sm">{stat.label}</p>
                      <p className="text-[#205072] text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#329D9C] to-[#56C596] rounded-xl flex items-center justify-center shadow-md">
                      <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="w-full bg-[#CFF4D2] rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#329D9C] to-[#56C596] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#205072] mb-4 px-1">Quick Access</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((module, idx) => (
                <Link key={idx} href={module.href} prefetch={true}>
                  <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-[#CFF4D2] bg-white/80 backdrop-blur-sm overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#329D9C] to-[#56C596] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#329D9C]/30 group-hover:scale-110 transition-transform">
                        <module.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <h3 className="font-bold text-[#205072] text-lg mb-1">{module.name}</h3>
                      <p className="text-sm text-[#329D9C] mb-2">{module.desc}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-[#56C596]" />
                        <span className="text-sm font-semibold text-[#205072]">{module.count}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
