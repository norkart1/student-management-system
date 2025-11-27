"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { clearAuthToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, GraduationCap, BookOpen, Layers, LogOut, Calendar, ChevronRight, Settings } from "lucide-react"

const menuItems = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    description: "Overview & Analytics"
  },
  { 
    name: "Students", 
    href: "/dashboard/students", 
    icon: GraduationCap,
    description: "Manage student records"
  },
  { 
    name: "Teachers", 
    href: "/dashboard/teachers", 
    icon: Users,
    description: "Faculty management"
  },
  { 
    name: "Books", 
    href: "/dashboard/books", 
    icon: BookOpen,
    description: "Library resources"
  },
  { 
    name: "Calendar", 
    href: "/dashboard/calendar", 
    icon: Calendar,
    description: "Events & Schedule"
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
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-white border-r border-slate-200 w-72 shadow-sm"
        )}
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Layers className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg tracking-tight">School SMS</h1>
              <p className="text-xs text-slate-500">Management System</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25"
                    : "hover:bg-slate-50 text-slate-600"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all shrink-0",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-slate-100 group-hover:bg-emerald-50"
                )}>
                  <Icon 
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-white" : "text-emerald-600"
                    )} 
                    strokeWidth={2} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    "text-sm font-semibold block",
                    isActive ? "text-white" : "text-slate-700"
                  )}>
                    {item.name}
                  </span>
                  <span className={cn(
                    "text-xs truncate block",
                    isActive ? "text-white/70" : "text-slate-400"
                  )}>
                    {item.description}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-white/70" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full justify-start gap-3 h-12 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-700"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-500" strokeWidth={2} />
            </div>
            <span className="text-sm font-medium">Settings</span>
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full justify-start gap-3 h-12 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
            onClick={handleLogout}
          >
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" strokeWidth={2} />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
