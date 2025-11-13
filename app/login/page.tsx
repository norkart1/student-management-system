"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { setAuthToken } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Lock, Eye, EyeOff, Leaf } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="relative w-full md:w-[45%] min-h-[40vh] md:min-h-screen bg-gradient-to-br from-[var(--tropical-primary)] to-[var(--tropical-secondary)] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/tropical_monstera_le_32feda22.jpg"
            alt="Tropical leaves background"
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--tropical-primary)]/30 to-[var(--tropical-secondary)]/40" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
              <Leaf className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-lg text-white/90">Login to your account</p>
          </div>
        </div>

        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Leaf className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="font-semibold text-sm">Student Portal</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--tropical-secondary)]">
                      <User className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <Input
                      type="text"
                      placeholder="admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading}
                      className="pl-12 h-14 rounded-2xl border-0 bg-[var(--tropical-mint)] text-gray-800 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[var(--tropical-secondary)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--tropical-secondary)]">
                      <Lock className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="pl-12 pr-12 h-14 rounded-2xl border-0 bg-[var(--tropical-mint)] text-gray-800 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[var(--tropical-secondary)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--tropical-secondary)] hover:text-[var(--tropical-primary)] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" strokeWidth={2} />
                      ) : (
                        <Eye className="w-5 h-5" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean | "indeterminate") => setRememberMe(checked === true)}
                    className="border-[var(--tropical-secondary)] data-[state=checked]:bg-[var(--tropical-secondary)] data-[state=checked]:border-[var(--tropical-secondary)]"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                  >
                    Remember Me
                  </label>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--tropical-secondary)',
                    color: 'white',
                  }}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Demo: admin / 12345@Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
