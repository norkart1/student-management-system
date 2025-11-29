"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { setAuthToken, setAdminData } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Lock, Eye, EyeOff, GraduationCap } from "lucide-react"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setAuthToken(data.token)
        if (data.admin) {
          setAdminData(data.admin)
        }
        router.push("/dashboard")
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFF4D2] via-white to-[#7BE495]/30 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-[#329D9C]/20 overflow-hidden border border-[#CFF4D2]">
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#205072] to-[#329D9C] mb-4 shadow-lg shadow-[#329D9C]/30">
                  <GraduationCap className="w-10 h-10 text-white" strokeWidth={2} />
                </div>
                <h1 className="text-2xl font-bold text-[#205072] mb-2">Welcome Back!</h1>
                <p className="text-sm text-[#329D9C]">Login to access your student portal</p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
                <div className="h-12 bg-gradient-to-r from-[#329D9C] to-[#56C596] rounded-xl mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CFF4D2] via-white to-[#7BE495]/30 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-[#329D9C]/20 overflow-hidden border border-[#CFF4D2]">
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#205072] to-[#329D9C] mb-4 shadow-lg shadow-[#329D9C]/30">
                <GraduationCap className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-2xl font-bold text-[#205072] mb-2">Welcome Back!</h1>
              <p className="text-sm text-[#329D9C]">Login to access your student portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#205072]">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#329D9C]">
                    <User className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="pl-12 h-12 rounded-xl border-[#CFF4D2] bg-[#CFF4D2]/30 text-[#205072] placeholder:text-[#329D9C]/60 focus-visible:ring-2 focus-visible:ring-[#329D9C] focus-visible:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#205072]">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#329D9C]">
                    <Lock className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pl-12 pr-12 h-12 rounded-xl border-[#CFF4D2] bg-[#CFF4D2]/30 text-[#205072] placeholder:text-[#329D9C]/60 focus-visible:ring-2 focus-visible:ring-[#329D9C] focus-visible:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#329D9C] hover:text-[#205072] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <Eye className="w-5 h-5" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean | "indeterminate") => setRememberMe(checked === true)}
                    className="border-[#CFF4D2] data-[state=checked]:bg-[#329D9C] data-[state=checked]:border-[#329D9C]"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-[#329D9C] cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-[#329D9C]/30 hover:shadow-xl transition-all duration-300 mt-6 bg-gradient-to-r from-[#329D9C] to-[#56C596] text-white hover:opacity-90"
              >
                {loading ? "Logging in..." : "Get Started"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
