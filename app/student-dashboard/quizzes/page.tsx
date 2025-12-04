"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  FileQuestion,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Search,
  GraduationCap,
  LogOut,
  User,
  Loader2,
  Trophy,
  Target,
  ArrowLeft
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Quiz {
  _id: string
  title: string
  description: string
  duration: number
  passingScore: number
  questionCount: number
  status: string
}

interface Attempt {
  _id: string
  quizId: string
  quizTitle: string
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  createdAt: string
}

export default function StudentQuizzesPage() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("student_token")
    const storedData = localStorage.getItem("student_data")

    if (!token || !storedData) {
      router.push("/student-login")
      return
    }

    const studentData = JSON.parse(storedData)
    setStudent(studentData)
    fetchQuizzes(token)
    fetchAttempts(token)
  }, [router])

  const fetchQuizzes = async (token: string) => {
    try {
      const res = await fetch("/api/quizzes?status=active", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setQuizzes(data)
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttempts = async (token: string) => {
    try {
      const res = await fetch("/api/quiz-attempts", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setAttempts(data)
      }
    } catch (error) {
      console.error("Failed to fetch attempts:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("student_token")
    localStorage.removeItem("student_data")
    router.push("/student-login")
  }

  const hasAttempted = (quizId: string) => {
    return attempts.some(a => a.quizId === quizId)
  }

  const getAttemptResult = (quizId: string) => {
    return attempts.find(a => a.quizId === quizId)
  }

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.description?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#205072] via-[#329D9C] to-[#56C596] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#205072] via-[#329D9C] to-[#56C596]">
      <header className="bg-[#205072]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#56C596] to-[#7BE495] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-white text-sm sm:text-base block truncate">Bright Future Academy</span>
                <span className="text-xs text-[#CFF4D2] hidden sm:block">Student Portal</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 overflow-hidden ring-2 ring-[#7BE495] flex-shrink-0">
                  {student?.imageUrl ? (
                    <Image
                      src={student.imageUrl}
                      alt={student.fullName}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <Link 
            href="/student-dashboard"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Available Quizzes</h1>
          <p className="text-sm sm:text-base text-[#CFF4D2]">Take quizzes and test your knowledge</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white/95 border-0 rounded-xl"
          />
        </div>

        {filteredQuizzes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => {
              const attempted = hasAttempted(quiz._id)
              const result = getAttemptResult(quiz._id)
              
              return (
                <Card key={quiz._id} className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-[#329D9C]/20 to-[#56C596]/20 flex items-center justify-center">
                    <FileQuestion className="w-12 h-12 text-[#329D9C]" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-[#205072] text-lg mb-1">{quiz.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{quiz.description || "No description"}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-1.5">
                        <FileQuestion className="w-4 h-4 text-slate-400" />
                        <span>{quiz.questionCount} questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{quiz.duration} min</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-4">
                      <Target className="w-4 h-4 text-slate-400" />
                      <span>{quiz.passingScore}% to pass</span>
                    </div>

                    {attempted && result ? (
                      <div className={`p-3 rounded-xl mb-3 ${result.passed ? "bg-emerald-50" : "bg-red-50"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {result.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className={`font-semibold ${result.passed ? "text-emerald-700" : "text-red-700"}`}>
                            {result.passed ? "Passed!" : "Not Passed"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          Score: {result.score}/{result.totalPoints} ({result.percentage}%)
                        </p>
                      </div>
                    ) : null}

                    {attempted ? (
                      <Button 
                        disabled
                        className="w-full gap-2 bg-slate-200 text-slate-500 cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Already Attempted
                      </Button>
                    ) : (
                      <Link href={`/student-dashboard/quizzes/${quiz._id}`}>
                        <Button className="w-full gap-2 bg-gradient-to-r from-[#329D9C] to-[#56C596] hover:from-[#205072] hover:to-[#329D9C] text-white">
                          <PlayCircle className="w-4 h-4" />
                          Start Quiz
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-[#329D9C]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-8 h-8 text-[#329D9C]" />
              </div>
              <h3 className="font-semibold text-[#205072] mb-1">No quizzes available</h3>
              <p className="text-slate-500 text-sm">Check back later for new quizzes</p>
            </CardContent>
          </Card>
        )}

        {attempts.length > 0 && (
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#205072]">
                <Trophy className="w-5 h-5 text-amber-500" />
                Your Quiz History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attempts.map((attempt) => (
                  <div 
                    key={attempt._id}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      attempt.passed ? "bg-emerald-50" : "bg-red-50"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-[#205072]">{attempt.quizTitle}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(attempt.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${attempt.passed ? "text-emerald-600" : "text-red-600"}`}>
                        {attempt.percentage}%
                      </p>
                      <p className="text-xs text-slate-500">
                        {attempt.score}/{attempt.totalPoints} points
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
