"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Users, GraduationCap, BookOpen, Calendar, FileText, TrendingUp, Activity, Clock } from "lucide-react"
import { ProfileDropdown } from "@/components/profile-dropdown"

export default function DashboardPage() {
  const quickStats = [
    { 
      label: "Total Students", 
      value: "1,240", 
      icon: Users, 
      color: "bg-blue-500",
      lightBg: "bg-blue-50",
      progress: 75
    },
    { 
      label: "Active Teachers", 
      value: "85", 
      icon: GraduationCap, 
      color: "bg-purple-500",
      lightBg: "bg-purple-50",
      progress: 60
    },
  ]

  const modules = [
    { 
      name: "Students", 
      href: "/dashboard/students", 
      icon: Users, 
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      desc: "Manage students",
      count: "1,240"
    },
    { 
      name: "Teachers", 
      href: "/dashboard/teachers", 
      icon: GraduationCap, 
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      desc: "Manage teachers",
      count: "85"
    },
    { 
      name: "Books", 
      href: "/dashboard/books", 
      icon: BookOpen, 
      color: "bg-gradient-to-br from-green-400 to-green-600",
      desc: "Library management",
      count: "3,560"
    },
  ]

  const todaysTasks = [
    {
      title: "Review new student applications",
      time: "10:00 AM",
      icon: FileText,
      color: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      title: "Staff meeting scheduled",
      time: "2:30 PM",
      icon: Users,
      color: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Update library database",
      time: "4:00 PM",
      icon: BookOpen,
      color: "bg-green-100",
      iconColor: "text-green-600"
    },
  ]

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          {/* Header with Greeting */}
          <div className="bg-gradient-to-br from-[var(--tropical-primary)] to-[var(--tropical-secondary)] rounded-3xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">Hi! Admin</h1>
                <p className="text-white/90 text-sm md:text-base">There are 3 important things today</p>
              </div>
              <ProfileDropdown />
            </div>

            {/* Quick Stats Cards inside header */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 md:p-5 shadow-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-gray-600 text-xs md:text-sm">{stat.label}</p>
                      <p className="text-gray-900 text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                      <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Plan */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Today's Plan</h2>
              <Activity className="w-6 h-6 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {todaysTasks.map((task, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 ${task.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <task.icon className={`w-6 h-6 ${task.iconColor}`} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm md:text-base">{task.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{task.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Modules */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 px-1">Quick Access</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((module, idx) => (
                <Link key={idx} href={module.href}>
                  <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0 bg-white overflow-hidden group">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 ${module.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <module.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{module.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{module.desc}</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-700">{module.count}</span>
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
