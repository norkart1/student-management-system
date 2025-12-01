"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GraduationCap, Hash, MessageSquare, FileText, BookOpen, Target } from "lucide-react"

interface Student {
  _id: string
  fullName: string
  email: string
}

interface Exam {
  _id: string
  name: string
  subject: string
  totalMarks: number
  passingMarks: number
}

interface EnterResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  exam: Exam | null
  students: Student[]
  existingResults?: any[]
}

export function EnterResultDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  exam, 
  students,
  existingResults = []
}: EnterResultDialogProps) {
  const [selectedStudent, setSelectedStudent] = useState("")
  const [marksObtained, setMarksObtained] = useState("")
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (open) {
      setSelectedStudent("")
      setMarksObtained("")
      setRemarks("")
      setSearchTerm("")
    }
  }, [open])

  const getExistingResult = (studentId: string) => {
    return existingResults.find(r => r.studentId === studentId)
  }

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId)
    const existing = getExistingResult(studentId)
    if (existing) {
      setMarksObtained(String(existing.marksObtained))
      setRemarks(existing.remarks || "")
    } else {
      setMarksObtained("")
      setRemarks("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!exam || !selectedStudent) return
    
    setLoading(true)
    try {
      await onSubmit({
        examId: exam._id,
        studentId: selectedStudent,
        marksObtained: Number(marksObtained),
        remarks,
      })
      setSelectedStudent("")
      setMarksObtained("")
      setRemarks("")
    } catch (error) {
      console.error("Error submitting result:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedStudentData = students.find(s => s._id === selectedStudent)
  const existingResult = selectedStudent ? getExistingResult(selectedStudent) : null

  if (!exam) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl font-bold">
            Enter Exam Results
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Record student marks for this exam
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-700">Exam:</span>
            <span className="text-slate-600">{exam.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-700">Subject:</span>
            <span className="text-slate-600">{exam.subject}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-slate-700">Total:</span>
              <span className="text-slate-600">{exam.totalMarks}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-slate-700">Passing:</span>
              <span className="text-slate-600">{exam.passingMarks}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
            <Label className="text-slate-700 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Select Student
            </Label>
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <div className="border border-slate-200 rounded-xl max-h-40 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const hasResult = getExistingResult(student._id)
                  return (
                    <div
                      key={student._id}
                      onClick={() => handleStudentSelect(student._id)}
                      className={`p-3 cursor-pointer border-b border-slate-100 last:border-0 transition-colors ${
                        selectedStudent === student._id
                          ? "bg-emerald-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-700">{student.fullName}</p>
                          <p className="text-sm text-slate-500">{student.email}</p>
                        </div>
                        {hasResult && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            hasResult.passed 
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {hasResult.grade} ({hasResult.marksObtained}/{exam.totalMarks})
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-4 text-center text-slate-500">
                  No students found
                </div>
              )}
            </div>
          </div>

          {selectedStudentData && (
            <>
              <div className="bg-emerald-50 rounded-xl p-3">
                <p className="text-sm text-emerald-700">
                  <span className="font-medium">Selected:</span> {selectedStudentData.fullName}
                  {existingResult && (
                    <span className="ml-2 text-amber-600">(Updating existing result)</span>
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marksObtained" className="text-slate-700 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-emerald-600" />
                  Marks Obtained (out of {exam.totalMarks})
                </Label>
                <Input
                  id="marksObtained"
                  type="number"
                  min="0"
                  max={exam.totalMarks}
                  placeholder={`Enter marks (0-${exam.totalMarks})`}
                  value={marksObtained}
                  onChange={(e) => setMarksObtained(e.target.value)}
                  required
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-slate-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Remarks (Optional)
                </Label>
                <Input
                  id="remarks"
                  placeholder="Any comments about the performance"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Close
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedStudent || !marksObtained}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md"
            >
              {loading ? "Saving..." : (existingResult ? "Update Result" : "Save Result")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
