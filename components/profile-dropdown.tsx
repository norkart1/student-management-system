"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { clearAuthToken, getAuthToken, getAdminData, clearAdminData } from "@/lib/auth"
import { UserCircle, LogOut, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminProfile {
  username: string
  email: string
  profileImage?: string
}

interface ProfileDropdownProps {
  variant?: 'light' | 'dark'
}

export function ProfileDropdown({ variant = 'dark' }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<AdminProfile | null>(null)
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

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const localData = getAdminData()
      if (localData) {
        setProfile({
          username: localData.username,
          email: localData.email || "",
          profileImage: localData.profileImage
        })
      }

      const token = getAuthToken()
      if (token) {
        const response = await fetch("/api/admin/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setProfile({
            username: data.username,
            email: data.email || "",
            profileImage: data.profileImage
          })
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    clearAdminData()
    router.push("/login")
  }

  const isLight = variant === 'light'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all",
          isLight ? "hover:bg-slate-100" : "hover:bg-white/10"
        )}
      >
        <div className={cn(
          "w-10 h-10 md:w-11 md:h-11 rounded-full backdrop-blur-sm flex items-center justify-center border-2 hover:scale-105 transition-transform overflow-hidden",
          isLight 
            ? "bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-300 shadow-lg shadow-emerald-500/20" 
            : "bg-white/20 border-white/30"
        )}>
          {profile?.profileImage ? (
            <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <UserCircle className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
          )}
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform hidden md:block",
          isLight ? "text-slate-500" : "text-white",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-7 h-7 text-white" strokeWidth={2} />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{profile?.username || "Admin"}</p>
                <p className="text-xs text-gray-500">{profile?.email || "admin@sms.com"}</p>
              </div>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left text-red-600"
            >
              <LogOut className="w-5 h-5" strokeWidth={2} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
