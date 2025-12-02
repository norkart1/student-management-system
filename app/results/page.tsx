"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Search, ArrowLeft, Calendar, User, BookOpen, Award, ChevronDown, ChevronUp, X, Loader2, Printer, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Subject {
  subjectId: string
  subjectName: string
  maxScore: number
  score: number
}

interface ExamResult {
  categoryId: string
  categoryName: string
  publishedAt: string
  subjects: Subject[]
  totalScore: number
  totalMaxScore: number
}

interface StudentInfo {
  fullName: string
  registrationNumber: string
  imageUrl?: string
}

interface PublishedExam {
  _id: string
  name: string
  description?: string
  thumbnailUrl?: string
  publishedAt: string
  subjectCount: number
  resultCount: number
}

function ResultsPageContent() {
  const searchParams = useSearchParams()
  const examId = searchParams.get("exam")
  
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [results, setResults] = useState<ExamResult[]>([])
  const [publishedExams, setPublishedExams] = useState<PublishedExam[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searched, setSearched] = useState(false)
  const [selectedExam, setSelectedExam] = useState<PublishedExam | null>(null)

  useEffect(() => {
    fetchPublishedExams()
  }, [])

  useEffect(() => {
    if (examId && publishedExams.length > 0) {
      const exam = publishedExams.find(e => e._id === examId)
      setSelectedExam(exam || null)
    } else {
      setSelectedExam(null)
    }
  }, [examId, publishedExams])

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
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setSearched(true)

    try {
      let url = `/api/public/results?registrationNumber=${encodeURIComponent(registrationNumber)}&dateOfBirth=${encodeURIComponent(dateOfBirth)}`
      if (examId) {
        url += `&categoryId=${encodeURIComponent(examId)}`
      }
      
      const res = await fetch(url)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to fetch results")
        setStudent(null)
        setResults([])
        return
      }

      if (data.type === "results") {
        setStudent(data.student)
        setResults(data.data)
        if (data.data.length > 0) {
          setExpandedCategories(new Set(data.data.map((r: ExamResult) => r.categoryId)))
        }
      }
    } catch (err) {
      setError("An error occurred while fetching results")
      setStudent(null)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const calculatePercentage = (score: number, maxScore: number) => {
    if (maxScore === 0) return 0
    return Math.round((score / maxScore) * 100)
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-emerald-600"
    if (percentage >= 75) return "text-blue-600"
    if (percentage >= 60) return "text-amber-600"
    if (percentage >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 print:bg-white print:min-h-0">
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50 print:static print:bg-white print:border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 print:shadow-none">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white print:text-gray-900">Bright Future Academy</h1>
              <p className="text-xs text-slate-400 print:text-gray-600">Results Portal</p>
            </div>
          </Link>
          <Link href="/" className="print:hidden">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 print:py-4 print:px-0">
        <div className="text-center mb-8 print:mb-4 print:hidden">
          <h1 className="text-3xl font-bold text-white mb-2">
            {selectedExam ? selectedExam.name : "Exam Results"}
          </h1>
          <p className="text-slate-400">Enter your registration number and date of birth to view your results</p>
          {selectedExam && (
            <div className="mt-4">
              <Link 
                href="/results"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
                Clear filter - View all exams
              </Link>
            </div>
          )}
        </div>
        
        <div className="hidden print:block text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedExam ? selectedExam.name : "Exam Results"}
          </h1>
          <p className="text-gray-600 text-sm mt-1">Bright Future Academy - Official Results</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 mb-8 print:hidden">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" />
                    Registration Number
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter registration number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
              >
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Results
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="bg-red-500/10 border-red-500/30 mb-8">
            <CardContent className="pt-6">
              <p className="text-red-400 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {student && searched && (
          <div className="space-y-6 print:space-y-4" id="results-content">
            <Card className="bg-slate-800/50 border-slate-700 print:bg-white print:border-gray-200">
              <CardContent className="pt-6 print:pt-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  {student.imageUrl ? (
                    <Image
                      src={student.imageUrl}
                      alt={student.fullName}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-xl object-cover border-2 border-amber-500/30 print:border-gray-300 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 print:bg-amber-500">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white print:text-gray-900">{student.fullName}</h2>
                    <p className="text-slate-400 print:text-gray-600">Registration No: {student.registrationNumber}</p>
                  </div>
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    size="sm"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 print:hidden mt-2 sm:mt-0"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Results
                  </Button>
                </div>
              </CardContent>
            </Card>

            {results.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No published results found for this student.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 print:space-y-2">
                {results.map((result) => {
                  const percentage = calculatePercentage(result.totalScore, result.totalMaxScore)
                  const isExpanded = expandedCategories.has(result.categoryId)
                  
                  return (
                    <Card key={result.categoryId} className="bg-slate-800/50 border-slate-700 overflow-hidden print:bg-white print:border-gray-200 print:break-inside-avoid">
                      <CardHeader 
                        className="cursor-pointer hover:bg-slate-700/30 transition-colors print:cursor-default print:hover:bg-transparent p-4 sm:p-6"
                        onClick={() => toggleCategory(result.categoryId)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 print:bg-amber-500">
                              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-white print:text-gray-900 text-base sm:text-lg leading-tight">{result.categoryName}</CardTitle>
                              <p className="text-xs sm:text-sm text-slate-400 print:text-gray-600">
                                {result.subjects.length} subject{result.subjects.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-13 sm:pl-0">
                            <div className="text-left sm:text-right">
                              <p className={`text-xl sm:text-2xl font-bold ${getGradeColor(percentage)} print:text-gray-900`}>
                                {percentage}%
                              </p>
                              <p className="text-xs sm:text-sm text-slate-400 print:text-gray-600">
                                {result.totalScore} / {result.totalMaxScore}
                              </p>
                            </div>
                            <div className="print:hidden">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {isExpanded && (
                        <CardContent className="border-t border-slate-700 print:border-gray-200">
                          <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
                            {result.subjects.map((subject) => {
                              const subjectPercentage = calculatePercentage(subject.score, subject.maxScore)
                              return (
                                <div
                                  key={subject.subjectId}
                                  className="grid grid-cols-[1fr_auto] sm:flex sm:items-center sm:justify-between p-2 sm:p-3 rounded-lg bg-slate-700/30 print:bg-gray-50 gap-2"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 print:text-amber-600 flex-shrink-0" />
                                    <span className="text-white print:text-gray-900 font-medium text-sm sm:text-base truncate">{subject.subjectName}</span>
                                  </div>
                                  <div className="flex items-center gap-2 sm:gap-4 justify-end">
                                    <span className="text-slate-400 print:text-gray-600 text-xs sm:text-sm whitespace-nowrap">
                                      {subject.score} / {subject.maxScore}
                                    </span>
                                    <span className={`font-bold text-sm sm:text-base ${getGradeColor(subjectPercentage)} print:text-gray-900 min-w-[3rem] text-right`}>
                                      {subjectPercentage}%
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {!searched && publishedExams.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Published Exams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publishedExams.map((exam) => (
                <Card key={exam._id} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-amber-500/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {exam.thumbnailUrl ? (
                        <Image
                          src={exam.thumbnailUrl}
                          alt={exam.name}
                          width={60}
                          height={60}
                          className="w-15 h-15 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-15 h-15 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">{exam.name}</h3>
                        {exam.description && (
                          <p className="text-sm text-slate-400 truncate">{exam.description}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          {exam.subjectCount} subject{exam.subjectCount !== 1 ? "s" : ""} | {exam.resultCount} result{exam.resultCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function ResultsPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Bright Future Academy</h1>
              <p className="text-xs text-slate-400">Results Portal</p>
            </div>
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsPageFallback />}>
      <ResultsPageContent />
    </Suspense>
  )
}
