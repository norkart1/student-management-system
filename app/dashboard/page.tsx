"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  const stats = [
    { label: "Total Students", value: "1,240", icon: "👨‍🎓", change: "+12%" },
    { label: "Total Teachers", value: "85", icon: "👨‍🏫", change: "+5%" },
    { label: "Total Books", value: "3,560", icon: "📖", change: "+23%" },
    { label: "Leave Records", value: "156", icon: "📅", change: "-8%" },
  ]

  const modules = [
    { name: "Students", href: "/dashboard/students", icon: "👨‍🎓", desc: "Manage student information" },
    { name: "Teachers", href: "/dashboard/teachers", icon: "👨‍🏫", desc: "Manage teacher profiles" },
    { name: "Books", href: "/dashboard/books", icon: "📖", desc: "Library book management" },
    { name: "Leave Records", href: "/dashboard/leaves", icon: "📅", desc: "Track leave requests" },
  ]

  return (
    <ProtectedLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Student Management System</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-accent mt-1">{stat.change}</p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Modules */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((module, idx) => (
              <Link key={idx} href={module.href}>
                <Card className="hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-3">{module.icon}</div>
                    <h3 className="font-semibold text-card-foreground">{module.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{module.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Overview of the management system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">System Status:</span>
                <span className="font-semibold text-accent flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full" /> Active
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database:</span>
                <span className="font-semibold">MongoDB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
