"use client"

import Link from "next/link"
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  Shield,
  ArrowRight,
  Lock,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">Bright Future Academy</span>
                <span className="text-xs text-slate-400 -mt-1">Private School</span>
              </div>
            </div>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg shadow-amber-500/20">
              <Link href="/login">
                <Lock className="w-4 h-4 mr-2" />
                Staff Login
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-[128px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-700/20 rounded-full blur-[128px]" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 backdrop-blur-sm rounded-full border border-amber-500/20 mb-8">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-amber-300 font-medium">Private Institution</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                  <span className="text-white">Welcome to</span>
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                    Bright Future Academy
                  </span>
                </h1>
                
                <p className="text-lg text-slate-400 max-w-lg mb-8 leading-relaxed">
                  Empowering young minds with quality education. Our comprehensive school management system helps staff manage students, teachers, exams, and more efficiently.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg shadow-amber-500/25 px-8">
                    <Link href="/login">
                      Staff Portal
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-2xl" />
                  <div className="relative bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                        <GraduationCap className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Staff Access Only</h3>
                      <p className="text-slate-400 text-sm mt-1">Authorized personnel login required</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-white/5">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Student Management</div>
                          <div className="text-sm text-slate-400">Records & profiles</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-white/5">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Exam System</div>
                          <div className="text-sm text-slate-400">Results & grading</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-white/5">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Events & Library</div>
                          <div className="text-sm text-slate-400">Calendar & books</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Our Core Values
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                At Bright Future Academy, we are committed to excellence in education
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Academic Excellence</h3>
                <p className="text-slate-400 text-sm">Committed to the highest standards of education and student achievement</p>
              </div>
              
              <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/25">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Dedicated Staff</h3>
                <p className="text-slate-400 text-sm">Experienced educators passionate about nurturing young minds</p>
              </div>
              
              <div className="text-center p-6 bg-slate-800/50 rounded-2xl border border-white/5">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Safe Environment</h3>
                <p className="text-slate-400 text-sm">A secure and supportive atmosphere for learning and growth</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-300">Bright Future Academy</span>
            </div>
            <p className="text-sm text-slate-500">
              Private Institution - Staff Access Only
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
