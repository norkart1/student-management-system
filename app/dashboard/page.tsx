"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp, ChevronRight } from "lucide-react"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip, Legend, Area, AreaChart } from "recharts"

const weeklyData = [
  { day: "Sat", students: 4, teachers: 2 },
  { day: "Sun", students: 6, teachers: 3 },
  { day: "Mon", students: 8, teachers: 4 },
  { day: "Tue", students: 5, teachers: 3 },
  { day: "Wed", students: 7, teachers: 5 },
  { day: "Thu", students: 9, teachers: 4 },
  { day: "Fri", students: 6, teachers: 3 },
]

const activityData = [
  { day: "Sat", activity: 45 },
  { day: "Sun", activity: 52 },
  { day: "Mon", activity: 38 },
  { day: "Tue", activity: 65 },
  { day: "Wed", activity: 48 },
  { day: "Thu", activity: 72 },
  { day: "Fri", activity: 58 },
]

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Welcome back</p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard Overview</h1>
            </div>
            <ProfileDropdown />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-400 via-purple-500 to-purple-600 p-5 shadow-lg shadow-purple-500/20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
              <p className="text-3xl md:text-4xl font-bold text-white">
                {loading ? "..." : (stats.students ?? 0)}
              </p>
              <p className="text-purple-100 text-sm mt-1">Total Students</p>
              <div className="mt-3 flex items-center gap-1 text-white/80 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>Active enrollments</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-300 via-amber-400 to-orange-400 p-5 shadow-lg shadow-orange-400/20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
              <p className="text-3xl md:text-4xl font-bold text-white">
                {loading ? "..." : (stats.teachers ?? 0)}
              </p>
              <p className="text-orange-100 text-sm mt-1">Active Teachers</p>
              <div className="mt-3 flex items-center gap-1 text-white/80 text-xs">
                <GraduationCap className="w-3 h-3" />
                <span>Faculty members</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 p-5 shadow-lg shadow-emerald-500/20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
              <p className="text-3xl md:text-4xl font-bold text-white">
                {loading ? "..." : (stats.books ?? 0)}
              </p>
              <p className="text-emerald-100 text-sm mt-1">Library Books</p>
              <div className="mt-3 flex items-center gap-1 text-white/80 text-xs">
                <BookOpen className="w-3 h-3" />
                <span>Available titles</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-rose-500 p-5 shadow-lg shadow-rose-500/20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
              <p className="text-3xl md:text-4xl font-bold text-white">5</p>
              <p className="text-rose-100 text-sm mt-1">Upcoming Events</p>
              <div className="mt-3 flex items-center gap-1 text-white/80 text-xs">
                <Calendar className="w-3 h-3" />
                <span>This month</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Weekly Overview</CardTitle>
                  <span className="text-xs text-slate-400">This Week</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-xs text-slate-500">Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400" />
                    <span className="text-xs text-slate-500">Teachers</span>
                  </div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} barGap={4}>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="students" 
                        fill="#a855f7" 
                        radius={[6, 6, 0, 0]}
                        maxBarSize={24}
                      />
                      <Bar 
                        dataKey="teachers" 
                        fill="#fb923c" 
                        radius={[6, 6, 0, 0]}
                        maxBarSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Activity Overview</CardTitle>
                  <span className="text-xs text-slate-400">Avg activity: 54</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="activity" 
                        stroke="#f97316" 
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorActivity)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Quick Access</h2>
              <span className="text-xs text-slate-400">Manage your system</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((module, idx) => (
                <Link key={idx} href={module.href} prefetch={true}>
                  <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0 shadow-md shadow-slate-200/50 bg-white overflow-hidden group h-full rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                          <module.icon className="w-6 h-6 text-white" strokeWidth={2} />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="font-semibold text-slate-800 text-base mb-1">{module.name}</h3>
                      <p className="text-xs text-slate-400 mb-2">{module.desc}</p>
                      <span className="inline-flex px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg">{module.count}</span>
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
