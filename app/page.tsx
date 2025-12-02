"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  Shield,
  ArrowRight,
  Lock,
  Building2,
  Search,
  Award,
  ChevronLeft,
  ChevronRight,
  Bell,
  Megaphone,
  AlertTriangle,
  Info,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdmissionApplicationForm } from "@/components/admission-application-form"

interface PublishedExam {
  _id: string
  name: string
  description?: string
  thumbnailUrl?: string
  publishedAt: string
  subjectCount: number
  resultCount: number
}

interface Announcement {
  _id: string
  title: string
  content: string
  type: "general" | "exam" | "event" | "urgent"
  createdAt: string
}

const schoolImages = [
  {
    src: "/school-images/students_in_modern_classroom.png",
    alt: "Students learning in modern classroom",
    caption: "Modern Learning Environment"
  },
  {
    src: "/school-images/students_studying_in_library.png",
    alt: "Students studying in library",
    caption: "Well-Equipped Library"
  },
  {
    src: "/school-images/modern_school_building_exterior.png",
    alt: "Modern school building",
    caption: "State-of-the-Art Campus"
  },
  {
    src: "/school-images/science_lab_with_students.png",
    alt: "Science laboratory",
    caption: "Advanced Science Labs"
  }
]

const getAnnouncementStyle = (type: string) => {
  switch (type) {
    case "urgent":
      return { bg: "bg-red-500", text: "text-white", label: "Urgent" }
    case "exam":
      return { bg: "bg-amber-500", text: "text-white", label: "Exam" }
    case "event":
      return { bg: "bg-blue-500", text: "text-white", label: "Event" }
    default:
      return { bg: "bg-emerald-500", text: "text-white", label: "General" }
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default function LandingPage() {
  const [publishedExams, setPublishedExams] = useState<PublishedExam[]>([])
  const [loadingExams, setLoadingExams] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % schoolImages.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + schoolImages.length) % schoolImages.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [nextSlide])

  useEffect(() => {
    fetchPublishedExams()
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements")
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data.slice(0, 5))
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err)
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  const fetchPublishedExams = async () => {
    try {
      const res = await fetch("/api/public/results")
      if (res.ok) {
        const data = await res.json()
        if (data.type === "categories") {
          setPublishedExams(data.data)
        }
      }
    } catch (err) {
      console.error("Failed to fetch published exams:", err)
    } finally {
      setLoadingExams(false)
    }
  }

  const isNewExam = (publishedAt: string) => {
    const publishDate = new Date(publishedAt)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

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
                
                <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                  Empowering young minds with quality education. Our comprehensive school management system helps staff manage students, teachers, exams, and more efficiently.
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-2xl" />
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    {schoolImages.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                          index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-semibold text-lg">{image.caption}</p>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={prevSlide}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/60 hover:bg-slate-900/80 rounded-full flex items-center justify-center text-white transition-colors z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/60 hover:bg-slate-900/80 rounded-full flex items-center justify-center text-white transition-colors z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="flex justify-center gap-2 py-3 bg-slate-800/80">
                    {schoolImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          index === currentSlide
                            ? "bg-amber-500"
                            : "bg-slate-600 hover:bg-slate-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <AdmissionApplicationForm />
                </div>

                {!loadingAnnouncements && announcements.length > 0 && (
                  <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-white/10">
                      <Bell className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto">
                      {announcements.map((announcement) => {
                        const style = getAnnouncementStyle(announcement.type)
                        return (
                          <div key={announcement._id} className="p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${style.bg} ${style.text}`}>
                                    {style.label}
                                  </span>
                                </div>
                                <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">
                                  {announcement.title}
                                </h4>
                                <p className="text-slate-400 text-xs line-clamp-2">
                                  {announcement.content}
                                </p>
                              </div>
                              <span className="text-slate-500 text-xs whitespace-nowrap">
                                {formatDate(announcement.createdAt)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {!loadingExams && publishedExams.length > 0 && (
          <section className="py-16 bg-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 backdrop-blur-sm rounded-full border border-amber-500/20 mb-4">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-amber-300 font-medium">Exam Results Published</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Latest Exam Results
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Click on any exam below to search and view your results
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedExams.map((exam) => (
                  <Link 
                    key={exam._id} 
                    href={`/results?exam=${exam._id}`}
                    className="group relative bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                  >
                    {isNewExam(exam.publishedAt) && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wide rounded shadow-lg transform -rotate-2">
                          NEW
                        </span>
                      </div>
                    )}
                    
                    <div className="aspect-video relative bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                      {exam.thumbnailUrl ? (
                        <Image
                          src={exam.thumbnailUrl}
                          alt={exam.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors">
                        {exam.name}
                      </h3>
                      {exam.description && (
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{exam.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {exam.subjectCount} subject{exam.subjectCount !== 1 ? "s" : ""}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
                          <Search className="w-4 h-4" />
                          Search Results
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button asChild variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
                  <Link href="/results">
                    View All Results
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

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
