"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, Home, Plus } from "lucide-react"

const navItems = [
  { 
    name: "Home", 
    href: "/dashboard", 
    icon: Home,
    color: "text-green-600",
    activeBg: "bg-green-50"
  },
  { 
    name: "Students", 
    href: "/dashboard/students", 
    icon: GraduationCap,
    color: "text-blue-600",
    activeBg: "bg-blue-50"
  },
  { 
    name: "Add",
    href: "#",
    icon: Plus,
    isCenter: true
  },
  { 
    name: "Teachers", 
    href: "/dashboard/teachers", 
    icon: Users,
    color: "text-purple-600",
    activeBg: "bg-purple-50"
  },
  { 
    name: "Books", 
    href: "/dashboard/books", 
    icon: BookOpen,
    color: "text-orange-600",
    activeBg: "bg-orange-50"
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.isCenter) {
            return (
              <button
                key={idx}
                className="flex flex-col items-center justify-center -mt-8"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--tropical-primary)] to-[var(--tropical-secondary)] rounded-full flex items-center justify-center shadow-xl">
                  <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </button>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-2xl transition-all min-w-[60px]",
                isActive && item.activeBg
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-all",
                  isActive ? item.color : "text-gray-400"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-xs font-medium transition-all",
                isActive ? item.color : "text-gray-400"
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
