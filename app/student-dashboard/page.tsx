"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogOut,
  User,
  School,
  Bell,
  Loader2,
  ArrowRight,
  BookMarked,
  ClipboardList,
  Mail,
  Phone,
  MapPin,
  UserCheck,
  Hash,
  Heart,
  Home,
  Trophy,
  FileText,
  Award
} from "lucide-react"

interface StudentData {
  _id?: string
  id: string
  fullName: string
  email: string
  phone: string
  imageUrl: string | null
  profileCompleted: boolean
  admissionStatus: "pending" | "approved" | "rejected"
  approvedClass: number | null
  classDetails?: any
  enrolledBooks?: any[]
  dateOfBirth?: string
  gender?: string
  parentName?: string
  parentPhone?: string
  parentEmail?: string
  address?: string
  previousSchool?: string
  registrationNumber?: string
  createdAt?: string
  approvedAt?: string
}

interface ExamResult {
  _id: string
  categoryId: string
  categoryName: string
  subjectName: string
  score: number
  maxScore: number
  passed: boolean
}

interface SubjectResult {
  subjectId?: string
  subjectName: string
  score: number
  maxScore: number
  passMarks?: number
  passed: boolean
}

interface ExamCategory {
  categoryId: string
  categoryName: string
  publishedAt?: string
  subjects: SubjectResult[]
  totalScore: number
  totalMaxScore: number
  percentage: number
  overallPassed: boolean
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [examResults, setExamResults] = useState<ExamCategory[]>([])
  const [loadingExams, setLoadingExams] = useState(false)
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [requestingClass, setRequestingClass] = useState(false)
  const [classRequestStatus, setClassRequestStatus] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("student_token")
    const storedData = localStorage.getItem("student_data")

    if (!token || !storedData) {
      router.push("/student-login")
      return
    }

    fetchStudentProfile(token)
    fetchClasses()
    fetchBooks()
    fetchAnnouncements()
  }, [router])

  const fetchStudentProfile = async (token: string) => {
    try {
      const res = await fetch("/api/student-auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        
        if (!data.profileCompleted) {
          localStorage.setItem("student_data", JSON.stringify(data))
          router.push("/student-dashboard/complete-profile")
          return
        }
        
        setStudent(data)
        localStorage.setItem("student_data", JSON.stringify(data))
        
        if (data.registrationNumber && data.dateOfBirth) {
          fetchExamResults(data.registrationNumber, data.dateOfBirth)
        }
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchExamResults = async (registrationNumber: string, dateOfBirth: string) => {
    setLoadingExams(true)
    try {
      const res = await fetch(`/api/public/results?registrationNumber=${encodeURIComponent(registrationNumber)}&dateOfBirth=${encodeURIComponent(dateOfBirth)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.type === "results" && data.data && Array.isArray(data.data)) {
          const transformedResults: ExamCategory[] = data.data.map((category: any) => {
            const subjects: SubjectResult[] = (category.subjects || []).map((subject: any) => {
              const passMarks = subject.passMarks ?? Math.round(subject.maxScore * 0.25)
              return {
                subjectId: subject.subjectId,
                subjectName: subject.subjectName,
                score: subject.score,
                maxScore: subject.maxScore,
                passMarks,
                passed: subject.score >= passMarks
              }
            })
            
            const totalScore = category.totalScore || subjects.reduce((sum: number, s: SubjectResult) => sum + s.score, 0)
            const totalMaxScore = category.totalMaxScore || subjects.reduce((sum: number, s: SubjectResult) => sum + s.maxScore, 0)
            const percentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0
            const overallPassed = subjects.every((s: SubjectResult) => s.passed)
            
            return {
              categoryId: category.categoryId,
              categoryName: category.categoryName,
              publishedAt: category.publishedAt,
              subjects,
              totalScore,
              totalMaxScore,
              percentage,
              overallPassed
            }
          })
          setExamResults(transformedResults)
        }
      }
    } catch (error) {
      console.error("Failed to fetch exam results:", error)
    } finally {
      setLoadingExams(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes")
      if (res.ok) {
        const data = await res.json()
        setClasses(data)
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error)
    }
  }

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books")
      if (res.ok) {
        const data = await res.json()
        setBooks(data)
      }
    } catch (error) {
      console.error("Failed to fetch books:", error)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements")
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data.slice(0, 5))
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("student_token")
    localStorage.removeItem("student_data")
    router.push("/student-login")
  }

  const handleClassRequest = async () => {
    if (!selectedClass) return

    const token = localStorage.getItem("student_token")
    setRequestingClass(true)

    try {
      const res = await fetch("/api/student-auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestedClass: selectedClass })
      })

      if (res.ok) {
        setClassRequestStatus("success")
        fetchStudentProfile(token!)
      } else {
        setClassRequestStatus("error")
      }
    } catch (error) {
      setClassRequestStatus("error")
    } finally {
      setRequestingClass(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-amber-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5" />
      case "rejected":
        return <XCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "text-emerald-600" }
    if (percentage >= 80) return { grade: "A", color: "text-emerald-500" }
    if (percentage >= 70) return { grade: "B+", color: "text-blue-600" }
    if (percentage >= 60) return { grade: "B", color: "text-blue-500" }
    if (percentage >= 50) return { grade: "C", color: "text-amber-600" }
    if (percentage >= 40) return { grade: "D", color: "text-orange-500" }
    return { grade: "F", color: "text-red-500" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#205072] via-[#329D9C] to-[#56C596] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  const myClassBooks = student.approvedClass
    ? books.filter((book) => book.classNumbers?.includes(student.approvedClass))
    : []

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
                  {student.imageUrl ? (
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Welcome back, {student.fullName.split(" ")[0]}!
          </h1>
          <p className="text-sm sm:text-base text-[#CFF4D2]">Here's your student dashboard</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-[#205072]/70">
                Admission Status
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${getStatusColor(
                    student.admissionStatus
                  )} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                >
                  {getStatusIcon(student.admissionStatus)}
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-bold text-[#205072] capitalize">
                    {student.admissionStatus}
                  </p>
                  <p className="text-xs sm:text-sm text-[#329D9C]">
                    {student.admissionStatus === "approved"
                      ? "You're officially enrolled!"
                      : student.admissionStatus === "rejected"
                      ? "Contact school for details"
                      : "Awaiting admin approval"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-[#205072]/70">
                Your Class
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#329D9C] to-[#56C596] flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <School className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  {student.classDetails ? (
                    <>
                      <p className="text-lg sm:text-xl font-bold text-[#205072]">
                        {student.classDetails.classNumber}
                        {student.classDetails.section && ` - ${student.classDetails.section}`}
                      </p>
                      <p className="text-xs sm:text-sm text-[#329D9C]">Enrolled class</p>
                    </>
                  ) : student.approvedClass ? (
                    <>
                      <p className="text-lg sm:text-xl font-bold text-[#205072]">
                        Assigned
                      </p>
                      <p className="text-xs sm:text-sm text-[#329D9C]">Enrolled class</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg sm:text-xl font-bold text-[#205072]">Not Assigned</p>
                      <p className="text-xs sm:text-sm text-[#329D9C]">Pending assignment</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-[#205072]/70">
                Class Books
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#56C596] to-[#7BE495] flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-bold text-[#205072]">
                    {student.classDetails?.books?.length || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-[#329D9C]">
                    {student.classDetails ? "For your class" : "Books available"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {student.admissionStatus === "pending" && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-500 mb-6 sm:mb-8">
            <CardContent className="py-4 sm:py-6 px-4 sm:px-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#205072] mb-1 text-sm sm:text-base">Admission Pending</h3>
                  <p className="text-[#205072]/70 text-xs sm:text-sm">
                    Your admission is being reviewed by the school administration. You'll receive
                    full access to the dashboard once your admission is approved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {student.admissionStatus === "rejected" && (
          <Card className="border-0 shadow-xl bg-red-50 border-l-4 border-l-red-500 mb-6 sm:mb-8">
            <CardContent className="py-4 sm:py-6 px-4 sm:px-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#205072] mb-1 text-sm sm:text-base">Admission Not Approved</h3>
                  <p className="text-[#205072]/70 text-xs sm:text-sm">
                    Unfortunately, your admission was not approved. Please contact
                    the school office for more information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {student.admissionStatus === "approved" && (
          <div className="space-y-6">
            {examResults.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#205072]">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Your Exam Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="space-y-4">
                    {examResults.map((category, idx) => (
                      <div key={idx} className="p-4 bg-gradient-to-br from-[#CFF4D2]/30 to-[#7BE495]/20 rounded-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-[#329D9C]" />
                            <h4 className="font-semibold text-[#205072] text-sm sm:text-base">{category.categoryName}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg sm:text-xl font-bold ${getGrade(category.percentage).color}`}>
                              {getGrade(category.percentage).grade}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              category.overallPassed 
                                ? "bg-emerald-100 text-emerald-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {category.overallPassed ? "Passed" : "Failed"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                          <div className="bg-white/60 rounded-lg p-2 text-center">
                            <p className="text-xs text-[#205072]/60">Total Score</p>
                            <p className="font-bold text-[#205072]">{category.totalScore}/{category.totalMaxScore}</p>
                          </div>
                          <div className="bg-white/60 rounded-lg p-2 text-center">
                            <p className="text-xs text-[#205072]/60">Percentage</p>
                            <p className="font-bold text-[#205072]">{category.percentage.toFixed(1)}%</p>
                          </div>
                          <div className="bg-white/60 rounded-lg p-2 text-center col-span-2 sm:col-span-2">
                            <p className="text-xs text-[#205072]/60">Subjects</p>
                            <p className="font-bold text-[#205072]">{category.subjects.length} subjects</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-[#205072]/70">Subject-wise Marks:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {category.subjects.map((subject, sIdx) => (
                              <div 
                                key={sIdx} 
                                className={`flex items-center justify-between p-2 rounded-lg ${
                                  subject.passed ? "bg-emerald-50" : "bg-red-50"
                                }`}
                              >
                                <span className="text-xs sm:text-sm text-[#205072] truncate flex-1">{subject.subjectName}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs sm:text-sm font-semibold ${
                                    subject.passed ? "text-emerald-600" : "text-red-600"
                                  }`}>
                                    {subject.score}/{subject.maxScore}
                                  </span>
                                  {subject.passed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {loadingExams && (
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardContent className="py-8 px-4 sm:px-6">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-[#329D9C]" />
                    <span className="text-[#205072]/70">Loading exam results...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {!loadingExams && examResults.length === 0 && (
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#205072]">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Your Exam Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="text-center py-6">
                    <FileText className="w-12 h-12 text-[#329D9C]/30 mx-auto mb-3" />
                    <p className="text-[#205072]/60 text-sm">No exam results available yet</p>
                    <p className="text-[#329D9C] text-xs mt-1">Results will appear here once published</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#205072]">
                  <User className="w-5 h-5 text-[#329D9C]" />
                  Student Profile Details
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#329D9C] to-[#56C596] overflow-hidden ring-4 ring-[#CFF4D2] shadow-xl">
                      {student.imageUrl ? (
                        <Image
                          src={student.imageUrl}
                          alt={student.fullName}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3 sm:mt-4 text-center lg:text-left">
                      <h3 className="text-lg sm:text-xl font-bold text-[#205072]">{student.fullName}</h3>
                      {student.registrationNumber && (
                        <p className="text-xs sm:text-sm text-[#329D9C] flex items-center gap-1 justify-center lg:justify-start mt-1">
                          <Hash className="w-3 h-3 sm:w-4 sm:h-4" />
                          {student.registrationNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-[#CFF4D2]/30 to-[#7BE495]/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#329D9C]" />
                        <span className="text-xs font-medium text-[#205072]/60">Email</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#205072] break-all">{student.email}</p>
                    </div>

                    <div className="p-3 sm:p-4 bg-gradient-to-br from-[#CFF4D2]/30 to-[#7BE495]/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#329D9C]" />
                        <span className="text-xs font-medium text-[#205072]/60">Phone</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#205072]">{student.phone || "N/A"}</p>
                    </div>

                    <div className="p-3 sm:p-4 bg-gradient-to-br from-[#CFF4D2]/30 to-[#7BE495]/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#329D9C]" />
                        <span className="text-xs font-medium text-[#205072]/60">Date of Birth</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#205072]">{formatDate(student.dateOfBirth)}</p>
                    </div>

                    <div className="p-3 sm:p-4 bg-gradient-to-br from-[#CFF4D2]/30 to-[#7BE495]/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-[#329D9C]" />
                        <span className="text-xs font-medium text-[#205072]/60">Gender</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#205072] capitalize">{student.gender || "N/A"}</p>
                    </div>

                    <div className="p-3 sm:p-4 bg-gradient-to-br from-[#CFF4D2]/30 to-[#7BE495]/20 rounded-xl sm:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#329D9C]" />
                        <span className="text-xs font-medium text-[#205072]/60">Address</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#205072]">{student.address || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#205072]">
                  <Heart className="w-5 h-5 text-[#329D9C]" />
                  Parent/Guardian Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-[#329D9C]/10 to-[#56C596]/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#329D9C]" />
                      <span className="text-xs font-medium text-[#205072]/60">Parent Name</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#205072]">{student.parentName || "N/A"}</p>
                  </div>

                  <div className="p-3 sm:p-4 bg-gradient-to-br from-[#329D9C]/10 to-[#56C596]/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#329D9C]" />
                      <span className="text-xs font-medium text-[#205072]/60">Parent Phone</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#205072]">{student.parentPhone || "N/A"}</p>
                  </div>

                  <div className="p-3 sm:p-4 bg-gradient-to-br from-[#329D9C]/10 to-[#56C596]/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-[#329D9C]" />
                      <span className="text-xs font-medium text-[#205072]/60">Parent Email</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#205072] break-all">{student.parentEmail || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {student.classDetails?.books && student.classDetails.books.length > 0 && (
                <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                  <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#205072]">
                      <BookMarked className="w-5 h-5 text-[#56C596]" />
                      Your Class Books
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <div className="space-y-2 sm:space-y-3">
                      {student.classDetails.books.slice(0, 5).map((book: any) => (
                        <div
                          key={book._id}
                          className="flex items-center gap-3 p-2 sm:p-3 bg-gradient-to-r from-[#CFF4D2]/40 to-[#7BE495]/20 rounded-xl"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#56C596] to-[#7BE495] flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#205072] truncate text-sm">{book.title}</p>
                            <p className="text-xs text-[#329D9C]">{book.author || "Unknown Author"}</p>
                          </div>
                        </div>
                      ))}
                      {student.classDetails.books.length > 5 && (
                        <p className="text-xs sm:text-sm text-[#329D9C] text-center pt-2">
                          +{student.classDetails.books.length - 5} more books
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#205072]">
                    <Bell className="w-5 h-5 text-[#329D9C]" />
                    Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  {announcements.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      {announcements.map((announcement) => (
                        <div
                          key={announcement._id}
                          className="p-2 sm:p-3 bg-gradient-to-r from-[#CFF4D2]/40 to-[#7BE495]/20 rounded-xl"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded ${
                                announcement.type === "urgent"
                                  ? "bg-red-100 text-red-700"
                                  : announcement.type === "exam"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-[#329D9C]/20 text-[#205072]"
                              }`}
                            >
                              {announcement.type}
                            </span>
                            <span className="text-xs text-[#329D9C]">
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-medium text-[#205072] text-xs sm:text-sm">
                            {announcement.title}
                          </p>
                          <p className="text-xs text-[#205072]/70 line-clamp-2">
                            {announcement.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#329D9C] text-center py-4 text-sm">No announcements yet</p>
                  )}
                </CardContent>
              </Card>

              {student.classDetails && (
                <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm lg:col-span-2">
                  <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#205072]">
                      <ClipboardList className="w-5 h-5 text-[#329D9C]" />
                      Class Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-[#205072]/10 to-[#329D9C]/10 rounded-xl">
                        <p className="text-xs sm:text-sm text-[#329D9C] mb-1">Class</p>
                        <p className="text-lg sm:text-xl font-bold text-[#205072]">
                          {student.classDetails.classNumber || student.approvedClass}
                        </p>
                      </div>
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-[#205072]/10 to-[#329D9C]/10 rounded-xl">
                        <p className="text-xs sm:text-sm text-[#329D9C] mb-1">Section</p>
                        <p className="text-lg sm:text-xl font-bold text-[#205072]">
                          {student.classDetails.section || "A"}
                        </p>
                      </div>
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-[#205072]/10 to-[#329D9C]/10 rounded-xl">
                        <p className="text-xs sm:text-sm text-[#329D9C] mb-1">Class Teacher</p>
                        <p className="text-base sm:text-xl font-bold text-[#205072] truncate">
                          {student.classDetails.teacherName || "Not Assigned"}
                        </p>
                      </div>
                      <div className="p-3 sm:p-4 bg-gradient-to-br from-[#205072]/10 to-[#329D9C]/10 rounded-xl">
                        <p className="text-xs sm:text-sm text-[#329D9C] mb-1">Students</p>
                        <p className="text-lg sm:text-xl font-bold text-[#205072]">
                          {student.classDetails.studentCount || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
