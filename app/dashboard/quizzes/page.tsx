"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { getAuthToken } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddQuizDialog } from "@/components/add-quiz-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { ViewQuizResultsDialog } from "@/components/view-quiz-results-dialog"
import { Spinner } from "@/components/spinner"
import { toast } from "sonner"
import { 
  FileQuestion, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Eye,
  Users,
  Clock,
  CheckCircle,
  FileText,
  PlayCircle,
  StopCircle,
  BarChart3,
  Globe
} from "lucide-react"

interface Quiz {
  _id: string
  title: string
  description: string
  duration: number
  passingScore: number
  status: "draft" | "active" | "closed"
  isPublic?: boolean
  questionCount: number
  attemptCount: number
  questions: any[]
  createdAt: string
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700", icon: FileText },
  active: { label: "Active", color: "bg-emerald-100 text-emerald-700", icon: PlayCircle },
  closed: { label: "Closed", color: "bg-amber-100 text-amber-700", icon: StopCircle },
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  const [addQuizDialogOpen, setAddQuizDialogOpen] = useState(false)
  const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null)
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false)
  const [quizForResults, setQuizForResults] = useState<Quiz | null>(null)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    const token = getAuthToken()
    try {
      const response = await fetch("/api/quizzes", {
        headers: { "Authorization": `Bearer ${token}` },
      })
      const data = await response.json()
      setQuizzes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveQuiz = async (formData: any) => {
    const token = getAuthToken()
    try {
      if (quizToEdit) {
        const response = await fetch(`/api/quizzes/${quizToEdit._id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          toast.success("Quiz updated successfully!")
          setQuizToEdit(null)
          fetchQuizzes()
        } else {
          toast.error("Failed to update quiz")
        }
      } else {
        const response = await fetch("/api/quizzes", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          toast.success("Quiz created successfully!")
          fetchQuizzes()
        } else {
          toast.error("Failed to create quiz")
        }
      }
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast.error("Failed to save quiz")
    }
  }

  const handleUpdateStatus = async (quiz: Quiz, newStatus: string) => {
    const token = getAuthToken()
    try {
      const response = await fetch(`/api/quizzes/${quiz._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        toast.success(`Quiz ${newStatus === "active" ? "activated" : "closed"} successfully!`)
        fetchQuizzes()
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  const handleEditClick = (quiz: Quiz) => {
    setQuizToEdit(quiz)
    setAddQuizDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setAddQuizDialogOpen(open)
    if (!open) {
      setQuizToEdit(null)
    }
  }

  const handleDeleteClick = (quiz: Quiz) => {
    setQuizToDelete(quiz)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return
    
    const token = getAuthToken()
    setDeleting(true)
    try {
      const response = await fetch(`/api/quizzes/${quizToDelete._id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      })
      if (response.ok) {
        toast.success("Quiz deleted successfully!")
        setDeleteDialogOpen(false)
        setQuizToDelete(null)
        fetchQuizzes()
      } else {
        toast.error("Failed to delete quiz")
      }
    } catch (error) {
      console.error("Error deleting quiz:", error)
      toast.error("Failed to delete quiz")
    } finally {
      setDeleting(false)
    }
  }

  const handleViewResults = (quiz: Quiz) => {
    setQuizForResults(quiz)
    setResultsDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredQuizzes = quizzes.filter((quiz) => 
    quiz.title.toLowerCase().includes(search.toLowerCase()) ||
    quiz.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProtectedLayout>
      <div className="p-6 md:p-8 lg:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <FileQuestion className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Quizzes</h1>
              <p className="text-slate-500 text-sm md:text-base">Create and manage quizzes for students</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium text-sm">
              {quizzes.length} Quizzes
            </span>
          </div>
        </div>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-800 text-lg">All Quizzes</CardTitle>
                <CardDescription className="text-slate-500">Create quizzes with multiple choice and true/false questions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner message="Loading quizzes..." />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search quizzes..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    />
                  </div>
                  <Button 
                    onClick={() => setAddQuizDialogOpen(true)} 
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/25 h-11 px-6 rounded-xl w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    New Quiz
                  </Button>
                </div>

                {filteredQuizzes.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredQuizzes.map((quiz) => {
                      const StatusIcon = statusConfig[quiz.status].icon
                      
                      return (
                        <div 
                          key={quiz._id} 
                          className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                        >
                          <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                            <FileQuestion className="w-12 h-12 text-emerald-300" />
                          </div>
                          
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-800 text-lg">{quiz.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-1">{quiz.description || "No description"}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleEditClick(quiz)}
                                  className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4 text-slate-500" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteClick(quiz)}
                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-slate-500" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[quiz.status].color}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusConfig[quiz.status].label}
                              </div>
                              {quiz.isPublic && (
                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                  <Globe className="w-3 h-3" />
                                  Public
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span>{quiz.questionCount} questions</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span>{quiz.duration} min</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span>{quiz.attemptCount} attempts</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-slate-400" />
                                <span>{quiz.passingScore}% to pass</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                              {quiz.status === "draft" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(quiz, "active")}
                                  className="gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  Activate
                                </Button>
                              )}
                              {quiz.status === "active" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(quiz, "closed")}
                                  className="gap-1.5 text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                                >
                                  <StopCircle className="w-3.5 h-3.5" />
                                  Close Quiz
                                </Button>
                              )}
                              {quiz.status === "closed" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(quiz, "active")}
                                  className="gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  Reactivate
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewResults(quiz)}
                                className="gap-1.5 text-xs border-slate-200"
                              >
                                <BarChart3 className="w-3.5 h-3.5" />
                                View Results
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileQuestion className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">No quizzes found</h3>
                    <p className="text-slate-500 text-sm mb-4">Create your first quiz to get started</p>
                    <Button 
                      onClick={() => setAddQuizDialogOpen(true)}
                      className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                    >
                      <Plus className="w-4 h-4" />
                      Create Quiz
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddQuizDialog
        open={addQuizDialogOpen}
        onOpenChange={handleDialogClose}
        onSave={handleSaveQuiz}
        editData={quizToEdit}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Quiz"
        itemName={quizToDelete?.title}
        loading={deleting}
      />

      <ViewQuizResultsDialog
        open={resultsDialogOpen}
        onOpenChange={setResultsDialogOpen}
        quiz={quizForResults}
      />
    </ProtectedLayout>
  )
}
