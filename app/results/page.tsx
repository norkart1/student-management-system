"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Search, ArrowLeft, Calendar, User, BookOpen, Award, ChevronDown, ChevronUp } from "lucide-react"
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

export default function ResultsPage() {
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [student, setStudent] = useState<StudentInfo | null>(null)
  const [results, setResults] = useState<ExamResult[]>([])
  const [publishedExams, setPublishedExams] = useState<PublishedExam[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    fetchPublishedExams()
  }, [])

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
      const res = await fetch(
        `/api/public/results?registrationNumber=${encodeURIComponent(registrationNumber)}&dateOfBirth=${encodeURIComponent(dateOfBirth)}`
      )
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
          <Link href="/">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Exam Results</h1>
          <p className="text-slate-400">Enter your registration number and date of birth to view your results</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 mb-8">
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
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  {student.imageUrl ? (
                    <Image
                      src={student.imageUrl}
                      alt={student.fullName}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-xl object-cover border-2 border-amber-500/30"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-white">{student.fullName}</h2>
                    <p className="text-slate-400">Registration No: {student.registrationNumber}</p>
                  </div>
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
              <div className="space-y-4">
                {results.map((result) => {
                  const percentage = calculatePercentage(result.totalScore, result.totalMaxScore)
                  const isExpanded = expandedCategories.has(result.categoryId)
                  
                  return (
                    <Card key={result.categoryId} className="bg-slate-800/50 border-slate-700 overflow-hidden">
                      <CardHeader 
                        className="cursor-pointer hover:bg-slate-700/30 transition-colors"
                        onClick={() => toggleCategory(result.categoryId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white">{result.categoryName}</CardTitle>
                              <p className="text-sm text-slate-400">
                                {result.subjects.length} subject{result.subjects.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className={`text-2xl font-bold ${getGradeColor(percentage)}`}>
                                {percentage}%
                              </p>
                              <p className="text-sm text-slate-400">
                                {result.totalScore} / {result.totalMaxScore}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {isExpanded && (
                        <CardContent className="border-t border-slate-700">
                          <div className="space-y-3 pt-4">
                            {result.subjects.map((subject) => {
                              const subjectPercentage = calculatePercentage(subject.score, subject.maxScore)
                              return (
                                <div
                                  key={subject.subjectId}
                                  className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30"
                                >
                                  <div className="flex items-center gap-3">
                                    <BookOpen className="w-5 h-5 text-amber-500" />
                                    <span className="text-white font-medium">{subject.subjectName}</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-slate-400">
                                      {subject.score} / {subject.maxScore}
                                    </span>
                                    <span className={`font-bold ${getGradeColor(subjectPercentage)}`}>
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
