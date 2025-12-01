"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { getAuthToken } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddExamDialog } from "@/components/add-exam-dialog"
import { EnterResultDialog } from "@/components/enter-result-dialog"
import { ViewResultsDialog } from "@/components/view-results-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { Spinner } from "@/components/spinner"
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  FileText, 
  Eye,
  BookOpen,
  Calendar,
  Target,
  Users
} from "lucide-react"

interface Exam {
  _id: string
  name: string
  subject: string
  date: string
  totalMarks: number
  passingMarks: number
  description?: string
}

interface Student {
  _id: string
  fullName: string
  email: string
}

interface Result {
  _id: string
  examId: string
  studentId: string
  studentName: string
  marksObtained: number
  percentage: number
  grade: string
  passed: boolean
  remarks?: string
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null)
  
  const [enterResultDialogOpen, setEnterResultDialogOpen] = useState(false)
  const [selectedExamForResult, setSelectedExamForResult] = useState<Exam | null>(null)
  const [examResults, setExamResults] = useState<Result[]>([])
  
  const [viewResultsDialogOpen, setViewResultsDialogOpen] = useState(false)
  const [selectedExamForView, setSelectedExamForView] = useState<Exam | null>(null)
  const [viewResults, setViewResults] = useState<Result[]>([])
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchExams()
    fetchStudents()
  }, [])

  const fetchExams = async () => {
    const token = getAuthToken()
    try {
      const response = await fetch("/api/exams", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setExams(data)
    } catch (error) {
      console.error("Error fetching exams:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const fetchResultsForExam = async (examId: string) => {
    const token = getAuthToken()
    try {
      const response = await fetch(`/api/results?examId=${examId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching results:", error)
      return []
    }
  }

  const handleAddExam = async (formData: any) => {
    const token = getAuthToken()
    try {
      if (examToEdit) {
        const response = await fetch(`/api/exams/${examToEdit._id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          setExamToEdit(null)
          fetchExams()
        }
      } else {
        const response = await fetch("/api/exams", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          fetchExams()
        }
      }
    } catch (error) {
      console.error("Error saving exam:", error)
    }
  }

  const handleEnterResults = async (exam: Exam) => {
    setSelectedExamForResult(exam)
    const results = await fetchResultsForExam(exam._id)
    setExamResults(results)
    setEnterResultDialogOpen(true)
  }

  const handleSubmitResult = async (resultData: any) => {
    const token = getAuthToken()
    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(resultData),
      })
      if (response.ok) {
        const results = await fetchResultsForExam(resultData.examId)
        setExamResults(results)
      }
    } catch (error) {
      console.error("Error saving result:", error)
    }
  }

  const handleViewResults = async (exam: Exam) => {
    setSelectedExamForView(exam)
    const results = await fetchResultsForExam(exam._id)
    setViewResults(results)
    setViewResultsDialogOpen(true)
  }

  const handleEditClick = (exam: Exam) => {
    setExamToEdit(exam)
    setAddDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setAddDialogOpen(open)
    if (!open) {
      setExamToEdit(null)
    }
  }

  const handleDeleteClick = (exam: Exam) => {
    setExamToDelete(exam)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!examToDelete) return
    
    const token = getAuthToken()
    setDeleting(true)
    try {
      const response = await fetch(`/api/exams/${examToDelete._id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      if (response.ok) {
        setDeleteDialogOpen(false)
        setExamToDelete(null)
        fetchExams()
      }
    } catch (error) {
      console.error("Error deleting exam:", error)
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredExams = exams.filter((exam) => 
    exam.name.toLowerCase().includes(search.toLowerCase()) ||
    exam.subject.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProtectedLayout>
      <div className="p-6 md:p-8 lg:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <ClipboardList className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Exams & Results</h1>
              <p className="text-slate-500 text-sm md:text-base">Manage exams and student results</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium text-sm">
              {exams.length} Total Exams
            </span>
          </div>
        </div>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-800 text-lg">All Exams</CardTitle>
                <CardDescription className="text-slate-500">View and manage all examination records</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner message="Loading exams..." />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search exams..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    />
                  </div>
                  <Button 
                    onClick={() => setAddDialogOpen(true)} 
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/25 h-11 px-6 rounded-xl w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Exam
                  </Button>
                </div>

                {filteredExams.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredExams.map((exam) => (
                      <div 
                        key={exam._id} 
                        className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleViewResults(exam)}
                              className="h-8 w-8 p-0 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg"
                              title="View Results"
                            >
                              <Eye className="w-4 h-4 text-emerald-500" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleEnterResults(exam)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                              title="Enter Results"
                            >
                              <Users className="w-4 h-4 text-blue-500" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleEditClick(exam)}
                              className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4 text-slate-500" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDeleteClick(exam)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-slate-500" />
                            </Button>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-slate-800 text-lg mb-1">{exam.name}</h3>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <BookOpen className="w-4 h-4 text-slate-400" />
                            <span>{exam.subject}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{formatDate(exam.date)}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Target className="w-4 h-4 text-slate-400" />
                              <span>Total: {exam.totalMarks}</span>
                            </div>
                            <div className="text-slate-600">
                              Pass: {exam.passingMarks}
                            </div>
                          </div>
                        </div>

                        {exam.description && (
                          <p className="mt-3 text-sm text-slate-500 line-clamp-2">{exam.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ClipboardList className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-medium text-slate-700 mb-1">No exams found</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      {search ? "Try adjusting your search" : "Create your first exam to get started"}
                    </p>
                    {!search && (
                      <Button 
                        onClick={() => setAddDialogOpen(true)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Exam
                      </Button>
                    )}
                  </div>
                )}

                <div className="text-sm text-slate-500">
                  Showing <span className="font-medium text-slate-700">{filteredExams.length}</span> of <span className="font-medium text-slate-700">{exams.length}</span> exams
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <AddExamDialog 
          open={addDialogOpen} 
          onOpenChange={handleDialogClose} 
          onSubmit={handleAddExam}
          initialData={examToEdit}
        />

        <EnterResultDialog
          open={enterResultDialogOpen}
          onOpenChange={setEnterResultDialogOpen}
          onSubmit={handleSubmitResult}
          exam={selectedExamForResult}
          students={students}
          existingResults={examResults}
        />

        <ViewResultsDialog
          open={viewResultsDialogOpen}
          onOpenChange={setViewResultsDialogOpen}
          exam={selectedExamForView}
          results={viewResults}
        />
        
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete Exam"
          itemName={examToDelete?.name}
          loading={deleting}
        />
      </div>
    </ProtectedLayout>
  )
}
