"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { clearAuthToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, Layers, LogOut, Menu, X } from "lucide-react"

const menuItems = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    textColor: "text-blue-600"
  },
  { 
    name: "Students", 
    href: "/dashboard/students", 
    icon: GraduationCap,
    color: "bg-orange-500",
    lightBg: "bg-orange-50",
    textColor: "text-orange-600"
  },
  { 
    name: "Teachers", 
    href: "/dashboard/teachers", 
    icon: Users,
    color: "bg-purple-500",
    lightBg: "bg-purple-50",
    textColor: "text-purple-600"
  },
  { 
    name: "Books", 
    href: "/dashboard/books", 
    icon: BookOpen,
    color: "bg-pink-500",
    lightBg: "bg-pink-50",
    textColor: "text-pink-600"
  },
  { 
    name: "Leave Records", 
    href: "/dashboard/leaves", 
    icon: Calendar,
    color: "bg-red-500",
    lightBg: "bg-red-50",
    textColor: "text-red-600"
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    clearAuthToken()
    router.push("/login")
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40",
          "w-72",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-screen">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Layers className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">SMS</h1>
                <p className="text-xs text-gray-500">Management</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                    isActive
                      ? `${item.color} text-white shadow-lg`
                      : `hover:${item.lightBg} text-gray-700`
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    isActive 
                      ? "bg-white/20" 
                      : `${item.lightBg} group-hover:scale-110`
                  )}>
                    <Icon 
                      className={cn(
                        "w-5 h-5",
                        isActive ? "text-white" : item.textColor
                      )} 
                      strokeWidth={2.5} 
                    />
                  </div>
                  <span className={cn(
                    "text-sm font-semibold",
                    isActive ? "text-white" : "text-gray-700"
                  )}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start gap-3 h-12 rounded-xl border-2 hover:bg-red-50 hover:border-red-200 transition-all"
              onClick={handleLogout}
            >
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
