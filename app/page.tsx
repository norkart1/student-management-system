"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Stats {
  students: number
  teachers: number
  books: number
}

export default function LandingPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-xl font-bold">SMS</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How It Works</a>
              <a href="#benefits" className="text-gray-400 hover:text-white transition-colors text-sm">Benefits</a>
            </nav>
            <Button asChild className="bg-white text-gray-900 hover:bg-gray-200 font-medium">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[128px]" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-8">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-300">The Future of School Management</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8">
                School Management
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">
                  Made Simple
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-xl mb-10 leading-relaxed">
                Streamline your entire institution with one powerful platform. 
                Students, teachers, library, and events — all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 px-8 py-6 text-lg font-medium shadow-lg shadow-emerald-500/25">
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg bg-transparent">
                  <a href="#features">See Features</a>
                </Button>
              </div>

              <div className="flex items-center gap-8 mt-12 pt-12 border-t border-white/10">
                <div>
                  {loading ? (
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                  ) : (
                    <div className="text-3xl font-bold text-white">{stats?.students || 0}</div>
                  )}
                  <div className="text-sm text-gray-500">Active Students</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  {loading ? (
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                  ) : (
                    <div className="text-3xl font-bold text-white">{stats?.teachers || 0}</div>
                  )}
                  <div className="text-sm text-gray-500">Teachers</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  {loading ? (
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                  ) : (
                    <div className="text-3xl font-bold text-white">{stats?.books || 0}</div>
                  )}
                  <div className="text-sm text-gray-500">Library Books</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-4">
                <span className="text-sm text-emerald-400">Features</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Powerful tools designed to make school administration effortless.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Users className="w-6 h-6" />}
                title="Student Management"
                description="Complete profiles with photos, contact details, and academic records."
                gradient="from-blue-500 to-blue-600"
                count={stats?.students}
                label="students"
                loading={loading}
              />
              <FeatureCard
                icon={<GraduationCap className="w-6 h-6" />}
                title="Teacher Directory"
                description="Centralized system for managing teacher information and qualifications."
                gradient="from-emerald-500 to-cyan-500"
                count={stats?.teachers}
                label="teachers"
                loading={loading}
              />
              <FeatureCard
                icon={<BookOpen className="w-6 h-6" />}
                title="Library System"
                description="Track books with ISBN, manage inventory, and catalog cover images."
                gradient="from-violet-500 to-purple-600"
                count={stats?.books}
                label="books"
                loading={loading}
              />
              <FeatureCard
                icon={<Calendar className="w-6 h-6" />}
                title="Event Calendar"
                description="Schedule exams, holidays, and important academic dates easily."
                gradient="from-orange-500 to-red-500"
              />
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Reports & PDF"
                description="Generate detailed reports and download them as professional PDFs."
                gradient="from-pink-500 to-rose-500"
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Secure Access"
                description="JWT authentication keeps your data protected at all times."
                gradient="from-teal-500 to-green-500"
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20 mb-4">
                <span className="text-sm text-cyan-400">How It Works</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Three Simple Steps
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Get started in minutes, not hours.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number="01"
                title="Login Securely"
                description="Access your dashboard with encrypted admin credentials."
              />
              <StepCard
                number="02"
                title="Add Your Data"
                description="Import students, teachers, and books with easy-to-use forms."
              />
              <StepCard
                number="03"
                title="Manage Everything"
                description="Track records, schedule events, and generate reports instantly."
              />
            </div>
          </div>
        </section>

        <section id="benefits" className="py-24 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 rounded-full border border-violet-500/20 mb-4">
                  <span className="text-sm text-violet-400">Why Choose Us</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                  Built for Modern Schools
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  Every feature is designed with educators in mind, making your daily tasks simpler and faster.
                </p>
                
                <div className="space-y-4">
                  <BenefitItem text="Intuitive interface anyone can use" />
                  <BenefitItem text="Works perfectly on any device" />
                  <BenefitItem text="Lightning-fast search & filters" />
                  <BenefitItem text="Automatic data backup" />
                  <BenefitItem text="QR codes for quick access" />
                  <BenefitItem text="Professional PDF exports" />
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
                <div className="relative bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <StatBox 
                      number={loading ? null : stats?.students} 
                      label="Students" 
                      loading={loading}
                    />
                    <StatBox 
                      number={loading ? null : stats?.teachers} 
                      label="Teachers" 
                      loading={loading}
                    />
                    <StatBox 
                      number={loading ? null : stats?.books} 
                      label="Books" 
                      loading={loading}
                    />
                    <StatBox 
                      number="24/7" 
                      label="Support" 
                      loading={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-px">
              <div className="relative bg-gray-950 rounded-[23px] p-8 sm:p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10" />
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Ready to Transform Your School?
                  </h2>
                  <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                    Join institutions that trust our platform for seamless management.
                  </p>
                  <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-200 px-10 py-6 text-lg font-medium">
                    <Link href="/login">
                      Start Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-gray-900" />
                </div>
                <span className="font-semibold">Student Management System</span>
              </div>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} SMS. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient,
  count,
  label,
  loading
}: { 
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  count?: number
  label?: string
  loading?: boolean
}) {
  return (
    <div className="group relative bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white`}>
          {icon}
        </div>
        {count !== undefined && (
          <div className="text-right">
            {loading ? (
              <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold text-white">{count}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </>
            )}
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function StepCard({ 
  number, 
  title, 
  description 
}: { 
  number: string
  title: string
  description: string 
}) {
  return (
    <div className="relative">
      <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent mb-4">
        {number}
      </div>
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      </div>
      <span className="text-gray-300">{text}</span>
    </div>
  )
}

function StatBox({ 
  number, 
  label,
  loading
}: { 
  number: number | string | null | undefined
  label: string
  loading: boolean
}) {
  return (
    <div className="text-center p-4 bg-white/5 rounded-2xl">
      {loading ? (
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-1" />
      ) : (
        <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{number ?? 0}</div>
      )}
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}
