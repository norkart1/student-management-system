"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { clearAuthToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, GraduationCap, BookOpen, Layers, LogOut, Calendar } from "lucide-react"

const menuItems = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard,
  },
  { 
    name: "Students", 
    href: "/dashboard/students", 
    icon: GraduationCap,
  },
  { 
    name: "Teachers", 
    href: "/dashboard/teachers", 
    icon: Users,
  },
  { 
    name: "Books", 
    href: "/dashboard/books", 
    icon: BookOpen,
  },
  { 
    name: "Calendar", 
    href: "/dashboard/calendar", 
    icon: Calendar,
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
          "hidden lg:block h-screen bg-white/80 backdrop-blur-xl border-r border-[#CFF4D2] w-72"
        )}
      >
        <div className="flex flex-col h-screen">
          <div className="p-6 border-b border-[#CFF4D2]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#205072] to-[#329D9C] rounded-2xl flex items-center justify-center shadow-lg shadow-[#329D9C]/30">
                <Layers className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-bold text-[#205072] text-lg">SMS</h1>
                <p className="text-xs text-[#56C596]">Management</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
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
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-[#329D9C] to-[#56C596] text-white shadow-lg shadow-[#329D9C]/30"
                      : "hover:bg-[#CFF4D2]/50 text-[#205072]"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-[#CFF4D2] group-hover:scale-110"
                  )}>
                    <Icon 
                      className={cn(
                        "w-5 h-5",
                        isActive ? "text-white" : "text-[#329D9C]"
                      )} 
                      strokeWidth={2.5} 
                    />
                  </div>
                  <span className={cn(
                    "text-sm font-semibold",
                    isActive ? "text-white" : "text-[#205072]"
                  )}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-[#CFF4D2]">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start gap-3 h-12 rounded-xl border-2 border-[#CFF4D2] hover:bg-red-50 hover:border-red-200 transition-all"
              onClick={handleLogout}
            >
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-[#205072]">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
