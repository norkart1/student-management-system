"use client"

import { useState, useEffect, useRef } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/spinner"
import { getAuthToken } from "@/lib/auth"
import { 
  User, 
  Mail, 
  Camera, 
  Settings,
  Shield,
  Calendar,
  Edit3,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

interface AdminProfile {
  id: string
  username: string
  email: string
  profileImage: string
  createdAt?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch("/api/admin/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner message="Loading profile..." />
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="p-6 md:p-8 lg:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <User className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">My Profile</h1>
              <p className="text-slate-500 text-sm md:text-base">View and manage your profile</p>
            </div>
          </div>
          <Link href="/dashboard/settings">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardContent className="p-6 -mt-16">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                  {profile?.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-white" />
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-800">{profile?.username || "Admin"}</h2>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Administrator</span>
                  </div>
                </div>

                <div className="w-full mt-8 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                      <p className="font-medium text-slate-700">{profile?.email || "admin@example.com"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Username</p>
                      <p className="font-medium text-slate-700">{profile?.username || "admin"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Role</p>
                      <p className="font-medium text-slate-700">System Administrator</p>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-6 pt-6 border-t border-slate-200">
                  <Link href="/dashboard/settings" className="block">
                    <Button variant="outline" className="w-full gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
