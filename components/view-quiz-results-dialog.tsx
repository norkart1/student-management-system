"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAuthToken } from "@/lib/auth"
import { Spinner } from "@/components/spinner"
import { 
  FileQuestion, 
  Search, 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Printer,
  GraduationCap
} from "lucide-react"

interface Quiz {
  _id: string
  title: string
  description: string
  duration: number
  passingScore: number
  isPublic?: boolean
  questions: any[]
}

interface QuizAttempt {
  _id: string
  quizId: string
  studentId?: string
  studentName?: string
  participantName?: string
  participantPhone?: string
  participantPlace?: string
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  createdAt: string
}

interface ViewQuizResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quiz: Quiz | null
}

export function ViewQuizResultsDialog({ open, onOpenChange, quiz }: ViewQuizResultsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [publicAttempts, setPublicAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "students" | "public">("all")
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && quiz) {
      fetchAttempts()
      setActiveTab("all")
    }
  }, [open, quiz])

  const fetchAttempts = async () => {
    if (!quiz) return
    
    setLoading(true)
    const token = getAuthToken()
    
    try {
      const [studentResponse, publicResponse] = await Promise.all([
        fetch(`/api/quiz-attempts?quizId=${quiz._id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        }),
        quiz.isPublic ? fetch(`/api/public/quiz-attempts?quizId=${quiz._id}`) : Promise.resolve(null)
      ])
      
      const studentData = await studentResponse.json()
      setAttempts(Array.isArray(studentData) ? studentData : [])
      
      if (publicResponse) {
        const publicData = await publicResponse.json()
        setPublicAttempts(Array.isArray(publicData) ? publicData : [])
      } else {
        setPublicAttempts([])
      }
    } catch (error) {
      console.error("Error fetching attempts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    if (!quiz) return
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const attemptsToShow = getFilteredAttempts()
    const sortedAttempts = [...attemptsToShow].sort((a, b) => b.percentage - a.percentage)

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quiz Results - ${quiz.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              color: #1e293b;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #0f766e;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
              color: #64748b;
            }
            .stats {
              display: flex;
              justify-content: center;
              gap: 30px;
              margin-bottom: 30px;
              flex-wrap: wrap;
            }
            .stat {
              text-align: center;
              padding: 15px 25px;
              background: #f8fafc;
              border-radius: 10px;
            }
            .stat-value {
              font-size: 28px;
              font-weight: bold;
              color: #0f766e;
            }
            .stat-label {
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e2e8f0;
            }
            th {
              background: #f1f5f9;
              font-weight: 600;
              color: #475569;
            }
            tr:nth-child(even) {
              background: #f8fafc;
            }
            .passed {
              color: #16a34a;
              font-weight: 500;
            }
            .failed {
              color: #dc2626;
              font-weight: 500;
            }
            .rank-1 {
              background: #fef3c7 !important;
            }
            .trophy {
              color: #f59e0b;
            }
            .tab-info {
              text-align: center;
              margin-bottom: 20px;
              padding: 10px;
              background: #f1f5f9;
              border-radius: 8px;
              color: #475569;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${quiz.title}</h1>
            <p>Quiz Results Report</p>
            <p style="font-size: 12px;">Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <div class="tab-info">
            ${activeTab === "all" ? "All Participants" : activeTab === "students" ? "Students Only" : "Public Participants Only"}
          </div>
          
          <div class="stats">
            <div class="stat">
              <div class="stat-value">${sortedAttempts.length}</div>
              <div class="stat-label">Participants</div>
            </div>
            <div class="stat">
              <div class="stat-value">${sortedAttempts.filter(a => a.passed).length}</div>
              <div class="stat-label">Passed</div>
            </div>
            <div class="stat">
              <div class="stat-value">${sortedAttempts.filter(a => !a.passed).length}</div>
              <div class="stat-label">Failed</div>
            </div>
            <div class="stat">
              <div class="stat-value">${sortedAttempts.length > 0 ? Math.round(sortedAttempts.reduce((sum, a) => sum + a.percentage, 0) / sortedAttempts.length) : 0}%</div>
              <div class="stat-label">Average Score</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Type</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${sortedAttempts.map((attempt, index) => `
                <tr class="${index === 0 ? 'rank-1' : ''}">
                  <td>${index + 1}${index === 0 ? ' 🏆' : ''}</td>
                  <td>${attempt.studentName || attempt.participantName || 'Anonymous'}</td>
                  <td>${attempt.studentId ? 'Student' : (attempt.participantPlace || 'Public')}</td>
                  <td>${attempt.score}/${attempt.totalPoints}</td>
                  <td>${attempt.percentage}%</td>
                  <td class="${attempt.passed ? 'passed' : 'failed'}">${attempt.passed ? 'Passed' : 'Failed'}</td>
                  <td>${new Date(attempt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  if (!quiz) return null

  const allAttempts = [
    ...attempts.map(a => ({ ...a, type: 'student' as const })),
    ...publicAttempts.map(a => ({ ...a, type: 'public' as const }))
  ]

  const getFilteredAttempts = () => {
    let filtered = allAttempts
    
    if (activeTab === "students") {
      filtered = allAttempts.filter(a => a.type === 'student')
    } else if (activeTab === "public") {
      filtered = allAttempts.filter(a => a.type === 'public')
    }
    
    if (searchTerm) {
      const name = (a: typeof allAttempts[0]) => a.studentName || a.participantName || ""
      filtered = filtered.filter(a => name(a).toLowerCase().includes(searchTerm.toLowerCase()))
    }
    
    return filtered
  }

  const filteredAttempts = getFilteredAttempts()

  const totalParticipants = allAttempts.length
  const passedCount = allAttempts.filter(a => a.passed).length
  const failedCount = totalParticipants - passedCount
  const passPercentage = totalParticipants > 0 ? Math.round((passedCount / totalParticipants) * 100) : 0
  const averageScore = totalParticipants > 0 
    ? Math.round(allAttempts.reduce((sum, a) => sum + a.percentage, 0) / totalParticipants)
    : 0
  const highestScore = totalParticipants > 0 
    ? Math.max(...allAttempts.map(a => a.percentage))
    : 0
  const lowestScore = totalParticipants > 0 
    ? Math.min(...allAttempts.map(a => a.percentage))
    : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-4xl w-[calc(100%-2rem)] mx-auto max-h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="p-6 pb-4">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                <FileQuestion className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <DialogTitle className="text-slate-800 text-xl font-bold truncate">
                  Quiz Results
                </DialogTitle>
                <DialogDescription className="text-slate-500 mt-1 truncate">
                  {quiz.title}
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </DialogHeader>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner message="Loading results..." />
          </div>
        ) : (
          <div className="flex-1 overflow-auto px-6 space-y-4" ref={printRef}>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700">Duration:</span>
                  <span className="text-slate-600">{quiz.duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700">Passing:</span>
                  <span className="text-slate-600">{quiz.passingScore}%</span>
                </div>
                {quiz.isPublic && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-amber-700">Public Quiz</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-700">{totalParticipants}</p>
                <p className="text-xs text-blue-600">Participants</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-700">{passedCount}</p>
                <p className="text-xs text-green-600">Passed ({passPercentage}%)</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-700">{failedCount}</p>
                <p className="text-xs text-red-600">Failed</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <Trophy className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-amber-700">{averageScore}%</p>
                <p className="text-xs text-amber-600">Average Score</p>
              </div>
            </div>

            {totalParticipants > 0 && (
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-600">
                  Highest: <span className="font-medium text-green-600">{highestScore}%</span>
                </span>
                <span className="text-slate-600">
                  Lowest: <span className="font-medium text-red-600">{lowestScore}%</span>
                </span>
              </div>
            )}

            {/* Tab buttons for filtering */}
            {(attempts.length > 0 || publicAttempts.length > 0) && (
              <div className="flex gap-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "all" 
                      ? "bg-emerald-500 text-white" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({allAttempts.length})
                </button>
                {attempts.length > 0 && (
                  <button
                    onClick={() => setActiveTab("students")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      activeTab === "students" 
                        ? "bg-emerald-500 text-white" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Students ({attempts.length})
                  </button>
                )}
                {publicAttempts.length > 0 && (
                  <button
                    onClick={() => setActiveTab("public")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      activeTab === "public" 
                        ? "bg-amber-500 text-white" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Public ({publicAttempts.length})
                  </button>
                )}
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
              />
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Rank</TableHead>
                    <TableHead className="font-semibold text-slate-700">Participant</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Score</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center hidden sm:table-cell">Date</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttempts.length > 0 ? (
                    [...filteredAttempts]
                      .sort((a, b) => b.percentage - a.percentage)
                      .map((attempt, index) => (
                        <TableRow key={attempt._id} className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-600">
                            <div className="flex items-center gap-1">
                              {index + 1}
                              {index === 0 && <Trophy className="w-4 h-4 text-amber-500" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-700">
                                {attempt.studentName || attempt.participantName || "Anonymous"}
                              </span>
                              <span className="text-xs text-slate-500">
                                {attempt.type === 'public' ? (
                                  <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    {attempt.participantPhone && (
                                      <span className="mr-1">{attempt.participantPhone}</span>
                                    )}
                                    {attempt.participantPlace || "Public"}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <GraduationCap className="w-3 h-3" />
                                    Student
                                  </span>
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-medium text-slate-700">{attempt.percentage}%</span>
                              <span className="text-xs text-slate-500">{attempt.score}/{attempt.totalPoints}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-slate-600 text-sm hidden sm:table-cell">
                            {formatDate(attempt.createdAt)}
                          </TableCell>
                          <TableCell className="text-center">
                            {attempt.passed ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3" />
                                Passed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                <XCircle className="w-3 h-3" />
                                Failed
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        {allAttempts.length === 0 ? "No attempts yet" : "No matching participants found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className="flex justify-end p-4 bg-slate-50/80 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
