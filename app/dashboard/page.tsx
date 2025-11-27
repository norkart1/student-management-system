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
        <div className="p-6 md:p-8 lg:p-10 space-y-8">
          <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Welcome back</p>
                <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-slate-300 text-sm md:text-base mt-1">Manage your school system efficiently</p>
              </div>
              <ProfileDropdown />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-5 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                      <p className="text-slate-800 text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/25">
                      <stat.icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((module, idx) => (
                <Link key={idx} href={module.href} prefetch={true}>
                  <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-200 bg-white overflow-hidden group h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                        <module.icon className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{module.name}</h3>
                      <p className="text-sm text-slate-500 mb-3">{module.desc}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md">{module.count}</span>
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
