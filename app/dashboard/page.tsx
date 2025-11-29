"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp, ChevronRight, Clock } from "lucide-react"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts"

interface WeeklyDataPoint {
  day: string
  date: string
  students: number
  teachers: number
  books: number
}

interface ActivityDataPoint {
  day: string
  date: string
  activity: number
}

interface StatsData {
  students: number | null
  teachers: number | null
  books: number | null
  weekly: WeeklyDataPoint[]
  activity: ActivityDataPoint[]
  avgActivity: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    students: null,
    teachers: null,
    books: null,
    weekly: [],
    activity: [],
    avgActivity: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())

  useEffect(() => {
    fetchStats()
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
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
        weekly: data.weekly || [],
        activity: data.activity || [],
        avgActivity: data.avgActivity || 0
      })
      setError(false)
    } catch (error) {
      console.error("Error fetching stats:", error)
      setStats({
        students: null,
        teachers: null,
        books: null,
        weekly: [],
        activity: [],
        avgActivity: 0
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Welcome back</p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard Overview</h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>{formatDate(currentDateTime)}</span>
                <span className="text-emerald-500 font-medium">{formatTime(currentDateTime)}</span>
              </div>
            </div>
            <ProfileDropdown variant="light" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Weekly Overview</CardTitle>
                  <span className="text-xs text-slate-400">Last 7 Days</span>
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
                  {loading ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      Loading chart data...
                    </div>
                  ) : stats.weekly.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      No data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.weekly} barGap={4}>
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
                          labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                              return payload[0]?.payload?.date || label
                            }
                            return label
                          }}
                        />
                        <Bar 
                          dataKey="students" 
                          fill="#a855f7" 
                          radius={[6, 6, 0, 0]}
                          maxBarSize={24}
                          name="Students Added"
                        />
                        <Bar 
                          dataKey="teachers" 
                          fill="#fb923c" 
                          radius={[6, 6, 0, 0]}
                          maxBarSize={24}
                          name="Teachers Added"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">Activity Overview</CardTitle>
                  <span className="text-xs text-slate-400">
                    Avg activity: {loading ? "..." : stats.avgActivity}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[220px] w-full">
                  {loading ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      Loading chart data...
                    </div>
                  ) : stats.activity.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      No activity data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.activity}>
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
                          labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                              return payload[0]?.payload?.date || label
                            }
                            return label
                          }}
                          formatter={(value: number) => [`${value} items`, 'Total Activity']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="activity" 
                          stroke="#f97316" 
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorActivity)"
                          name="Activity"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Quick Access</h2>
              <span className="text-xs text-slate-400">Manage your system</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
              {modules.map((module, idx) => (
                <Link key={idx} href={module.href} prefetch={true} className="block h-full">
                  <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0 shadow-md shadow-slate-200/50 bg-white overflow-hidden group h-full rounded-2xl flex flex-col">
                    <CardContent className="p-5 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                          <module.icon className="w-6 h-6 text-white" strokeWidth={2} />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 text-base mb-1">{module.name}</h3>
                        <p className="text-xs text-slate-400 mb-2">{module.desc}</p>
                      </div>
                      <span className="inline-flex px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg self-start">{module.count}</span>
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
