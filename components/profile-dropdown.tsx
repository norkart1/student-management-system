"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { clearAuthToken } from "@/lib/auth"
import { UserCircle, LogOut, Settings, User, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    clearAuthToken()
    router.push("/login")
  }

  const menuItems = [
    {
      icon: User,
      label: "My Profile",
      onClick: () => {
        setIsOpen(false)
        // Add profile navigation here
      }
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => {
        setIsOpen(false)
        // Add settings navigation here
      }
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: handleLogout,
      className: "text-red-600 hover:bg-red-50"
    }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all"
      >
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 hover:scale-105 transition-transform">
          <UserCircle className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-white transition-transform hidden md:block",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--tropical-primary)] to-[var(--tropical-secondary)] flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">admin@sms.com</p>
              </div>
            </div>
          </div>

          <div className="py-2">
            {menuItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left",
                    item.className
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
