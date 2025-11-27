"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, GraduationCap, BookOpen, Home, Calendar } from "lucide-react"

const navItems = [
  { 
    name: "Home", 
    href: "/dashboard", 
    icon: Home,
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

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 min-w-[60px]",
                isActive 
                  ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md" 
                  : "hover:bg-slate-50 active:scale-95"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive ? "text-white" : "text-slate-600"
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                isActive ? "text-white" : "text-slate-600"
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
