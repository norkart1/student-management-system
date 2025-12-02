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
  Loader2,
  Search,
  Megaphone,
  ClipboardList,
  Hash,
  Trophy,
  X,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Stats {
  students: number
  teachers: number
  books: number
}

interface Announcement {
  _id: string
  title: string
  content: string
  type: "general" | "exam" | "event" | "urgent"
  pinned: boolean
  createdAt: string
}

interface PublishedExam {
  _id: string
  name: string
  description: string
  thumbnailUrl?: string
  publishedAt: string
  subjectCount: number
  resultCount: number
}

interface StudentResult {
  categoryId: string
  categoryName: string
  publishedAt: string
  subjects: Array<{
    subjectId: string
    subjectName: string
    maxScore: number
    score: number
  }>
  totalScore: number
  totalMaxScore: number
}

interface SearchResult {
  student: {
    fullName: string
    registrationNumber: string
    imageUrl?: string
  }
  data: StudentResult[]
}

export default function LandingPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [publishedExams, setPublishedExams] = useState<PublishedExam[]>([])
  
  const [searchRegNo, setSearchRegNo] = useState("")
  const [searchDateOfBirth, setSearchDateOfBirth] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [searchError, setSearchError] = useState("")
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, announcementsRes, examsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/announcements?limit=5'),
          fetch('/api/public/results'),
        ])
        
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data)
        }
        
        if (announcementsRes.ok) {
          const data = await announcementsRes.json()
          setAnnouncements(data)
        }
        
        if (examsRes.ok) {
          const data = await examsRes.json()
          if (data.type === "categories") {
            setPublishedExams(data.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSearch = async () => {
    if (!searchRegNo.trim() || !searchDateOfBirth) return
    
    setSearching(true)
    setSearchError("")
    setSearchResult(null)
    
    try {
      const response = await fetch(`/api/public/results?registrationNumber=${encodeURIComponent(searchRegNo.trim())}&dateOfBirth=${encodeURIComponent(searchDateOfBirth)}`)
      const data = await response.json()
      
      if (!response.ok) {
        setSearchError(data.error || "Failed to find results")
      } else if (data.type === "results") {
        setSearchResult(data)
        setShowResults(true)
      }
    } catch (error) {
      setSearchError("Failed to search. Please try again.")
    } finally {
      setSearching(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case "urgent": return "border-red-500 bg-red-500/10"
      case "exam": return "border-emerald-500 bg-emerald-500/10"
      case "event": return "border-blue-500 bg-blue-500/10"
      default: return "border-white/20 bg-white/5"
    }
  }

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
              <a href="#results" className="text-gray-400 hover:text-white transition-colors text-sm">Results</a>
              <a href="#announcements" className="text-gray-400 hover:text-white transition-colors text-sm">Announcements</a>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
            </nav>
            <Button asChild className="bg-white text-gray-900 hover:bg-gray-200 font-medium">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[128px]" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-8">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-300">Student Management System</span>
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
                Check your exam results, view announcements, and more.
              </p>

              <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/10">
                <div>
                  {loading ? (
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                  ) : (
                    <div className="text-3xl font-bold text-white">{stats?.students || 0}</div>
                  )}
                  <div className="text-sm text-gray-500">Students</div>
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
                  <div className="text-3xl font-bold text-white">{publishedExams.length}</div>
                  <div className="text-sm text-gray-500">Published Exams</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="results" className="py-16 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 mb-4">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400">Exam Results</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Search Your Results
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Enter your registration number and date of birth to view your exam results
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      placeholder="Registration Number"
                      value={searchRegNo}
                      onChange={(e) => setSearchRegNo(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-12 h-14 bg-gray-900/50 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 text-lg"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type="date"
                      placeholder="Date of Birth"
                      value={searchDateOfBirth}
                      onChange={(e) => setSearchDateOfBirth(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-12 h-14 bg-gray-900/50 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 text-lg [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={searching || !searchRegNo.trim() || !searchDateOfBirth}
                    className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium"
                  >
                    {searching ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                
                {searchError && (
                  <p className="mt-4 text-red-400 text-center">{searchError}</p>
                )}
              </div>
            </div>

            {showResults && searchResult && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center overflow-hidden">
                        {searchResult.student.imageUrl ? (
                          <img src={searchResult.student.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <GraduationCap className="w-7 h-7 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{searchResult.student.fullName}</h3>
                        <p className="text-gray-400 flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          {searchResult.student.registrationNumber}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowResults(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {searchResult.data.length > 0 ? (
                      <div className="space-y-6">
                        {searchResult.data.map((exam) => (
                          <div key={exam.categoryId} className="bg-gray-800/50 border border-white/10 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-semibold text-white">{exam.categoryName}</h4>
                                <p className="text-sm text-gray-500">Published: {formatDate(exam.publishedAt)}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-400">
                                  {exam.totalScore}/{exam.totalMaxScore}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {((exam.totalScore / exam.totalMaxScore) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid gap-2">
                              {exam.subjects.map((subject) => (
                                <div key={subject.subjectId} className="flex items-center justify-between py-2 px-3 bg-gray-900/50 rounded-lg">
                                  <span className="text-gray-300">{subject.subjectName}</span>
                                  <span className="font-medium text-white">
                                    {subject.score} / {subject.maxScore}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                        <p>No published results found for this student</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {publishedExams.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-center mb-6">Published Exam Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publishedExams.map((exam) => (
                    <div key={exam._id} className="bg-gray-800/50 border border-white/10 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all">
                      {exam.thumbnailUrl ? (
                        <div className="aspect-video overflow-hidden">
                          <img src={exam.thumbnailUrl} alt={exam.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                          <FileText className="w-12 h-12 text-emerald-400/50" />
                        </div>
                      )}
                      <div className="p-5">
                        <h4 className="font-semibold text-white mb-1">{exam.name}</h4>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{exam.description || "Exam results published"}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{exam.subjectCount} subjects</span>
                          <span>{exam.resultCount} results</span>
                        </div>
                        <p className="text-xs text-emerald-400 mt-2">Published: {formatDate(exam.publishedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {announcements.length > 0 && (
          <section id="announcements" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
                  <Megaphone className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400">Announcements</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Latest Updates
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Stay informed with the latest news and announcements
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {announcements.map((announcement) => (
                  <div 
                    key={announcement._id} 
                    className={`border-l-4 rounded-r-xl p-5 ${getAnnouncementColor(announcement.type)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {announcement.pinned && (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">Pinned</span>
                          )}
                          <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded-full capitalize">
                            {announcement.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{announcement.title}</h3>
                        <p className="text-gray-400">{announcement.content}</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(announcement.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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
                icon={<ClipboardList className="w-6 h-6" />}
                title="Exam System"
                description="Create categories, add subjects, manage applications, and publish results."
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
