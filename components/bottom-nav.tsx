"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Home, 
  Plus, 
  X,
  ClipboardList,
  User,
  Settings,
  School,
  UserPlus,
  UserCheck
} from "lucide-react"

const expandedNavItems = [
  { 
    name: "Classes", 
    href: "/dashboard/classes", 
    icon: School,
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
    name: "Exams", 
    href: "/dashboard/exams", 
    icon: ClipboardList,
  },
  { 
    name: "Books", 
    href: "/dashboard/books", 
    icon: BookOpen,
  },
  { 
    name: "Admissions", 
    href: "/dashboard/admissions", 
    icon: UserPlus,
  },
  { 
    name: "Accounts", 
    href: "/dashboard/student-admissions", 
    icon: UserCheck,
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isExpandedItemActive = expandedNavItems.some(item => pathname === item.href)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded])

  useEffect(() => {
    setIsExpanded(false)
  }, [pathname])

  return (
    <>
      {isExpanded && (
        <div 
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-200"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <nav ref={menuRef} className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div 
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-all duration-300 ease-out",
            isExpanded 
              ? "opacity-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-3">
            <div className="grid grid-cols-3 gap-1">
              {expandedNavItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                const shortName = item.name === "Admissions" ? "Admit" : 
                                  item.name === "Students" ? "Student" : 
                                  item.name === "Teachers" ? "Teacher" : item.name

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl transition-all duration-200 min-w-[60px] max-w-[70px]",
                      isActive 
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md" 
                        : "hover:bg-slate-100 active:scale-95 bg-slate-50"
                    )}
                  >
                    <Icon 
                      className={cn(
                        "w-5 h-5 transition-all duration-200 flex-shrink-0",
                        isActive ? "text-white" : "text-slate-600"
                      )} 
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className={cn(
                      "text-[9px] font-medium transition-all duration-200 text-center leading-tight",
                      isActive ? "text-white" : "text-slate-600"
                    )}>
                      {shortName}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45" />
        </div>

        <div className="bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between px-6 py-2 safe-area-bottom">
            <Link
              href="/dashboard"
              prefetch={true}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200",
                pathname === "/dashboard" 
                  ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md" 
                  : "hover:bg-slate-50 active:scale-95"
              )}
            >
              <Home 
                className={cn(
                  "w-6 h-6 transition-all duration-200",
                  pathname === "/dashboard" ? "text-white" : "text-slate-600"
                )} 
                strokeWidth={pathname === "/dashboard" ? 2.5 : 2}
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-200",
                pathname === "/dashboard" ? "text-white" : "text-slate-600"
              )}>
                Home
              </span>
            </Link>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-lg -mt-6",
                isExpanded 
                  ? "bg-slate-600 rotate-45" 
                  : isExpandedItemActive
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                    : "bg-gradient-to-br from-emerald-500 to-teal-500"
              )}
            >
              {isExpanded ? (
                <X className="w-7 h-7 text-white" strokeWidth={2.5} />
              ) : (
                <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
              )}
            </button>

            <div className="flex items-center gap-1">
              <Link
                href="/dashboard/profile"
                prefetch={true}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200",
                  pathname === "/dashboard/profile" 
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md" 
                    : "hover:bg-slate-50 active:scale-95"
                )}
              >
                <User 
                  className={cn(
                    "w-6 h-6 transition-all duration-200",
                    pathname === "/dashboard/profile" ? "text-white" : "text-slate-600"
                  )} 
                  strokeWidth={pathname === "/dashboard/profile" ? 2.5 : 2}
                />
                <span className={cn(
                  "text-xs font-medium transition-all duration-200",
                  pathname === "/dashboard/profile" ? "text-white" : "text-slate-600"
                )}>
                  Profile
                </span>
              </Link>

              <Link
                href="/dashboard/settings"
                prefetch={true}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200",
                  pathname === "/dashboard/settings" 
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md" 
                    : "hover:bg-slate-50 active:scale-95"
                )}
              >
                <Settings 
                  className={cn(
                    "w-6 h-6 transition-all duration-200",
                    pathname === "/dashboard/settings" ? "text-white" : "text-slate-600"
                  )} 
                  strokeWidth={pathname === "/dashboard/settings" ? 2.5 : 2}
                />
                <span className={cn(
                  "text-xs font-medium transition-all duration-200",
                  pathname === "/dashboard/settings" ? "text-white" : "text-slate-600"
                )}>
                  Settings
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
