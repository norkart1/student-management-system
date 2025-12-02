"use client"

import dynamic from "next/dynamic"
import { GraduationCap } from "lucide-react"

const LoginForm = dynamic(() => import("@/components/login-form"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden border border-amber-100">
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg shadow-amber-500/30">
                <GraduationCap className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Bright Future Academy</h1>
              <p className="text-sm text-slate-500">Staff Portal Login</p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              </div>
              <div className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl mt-6 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
})

export default function LoginPage() {
  return <LoginForm />
}
