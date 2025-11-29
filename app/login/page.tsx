import dynamic from "next/dynamic"
import { GraduationCap } from "lucide-react"

const LoginForm = dynamic(() => import("@/components/login-form"), {
  ssr: false,
  loading: () => (
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
  ),
})

export default function LoginPage() {
  return <LoginForm />
}
