"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Hash, BookOpen, Save, Loader2, CheckCircle } from "lucide-react"

interface Subject {
  _id: string
  name: string
  maxScore: number
}

interface ApprovedStudent {
  _id: string
  studentId: string
  studentName: string
  registrationNumber: string
  studentImage?: string
}

interface ExistingResult {
  subjectId: string
  score: number
}

interface EnterScoresDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string
  categoryName: string
  subjects: Subject[]
  approvedStudents: ApprovedStudent[]
  existingResults: Map<string, ExistingResult[]>
  onSaveScores: (studentId: string, scores: Array<{ subjectId: string; score: number }>) => Promise<void>
}

export function EnterScoresDialog({ 
  open, 
  onOpenChange, 
  categoryId,
  categoryName,
  subjects,
  approvedStudents,
  existingResults,
  onSaveScores,
}: EnterScoresDialogProps) {
  const [selectedStudent, setSelectedStudent] = useState<ApprovedStudent | null>(null)
  const [scores, setScores] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (selectedStudent) {
      const studentResults = existingResults.get(selectedStudent.studentId) || []
      const initialScores: Record<string, string> = {}
      subjects.forEach(subject => {
        const existingResult = studentResults.find(r => r.subjectId === subject._id)
        initialScores[subject._id] = existingResult ? String(existingResult.score) : ""
      })
      setScores(initialScores)
      setSaved(false)
    }
  }, [selectedStudent, subjects, existingResults])

  useEffect(() => {
    if (open) {
      setSelectedStudent(null)
      setScores({})
      setSearchTerm("")
      setSaved(false)
    }
  }, [open])

  const handleScoreChange = (subjectId: string, value: string) => {
    setScores(prev => ({ ...prev, [subjectId]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!selectedStudent) return

    const scoresArray = Object.entries(scores)
      .filter(([_, value]) => value !== "")
      .map(([subjectId, value]) => ({
        subjectId,
        score: Number(value),
      }))

    if (scoresArray.length === 0) return

    setSaving(true)
    try {
      await onSaveScores(selectedStudent.studentId, scoresArray)
      setSaved(true)
    } catch (error) {
      console.error("Error saving scores:", error)
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = approvedStudents.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStudentProgress = (studentId: string) => {
    const results = existingResults.get(studentId) || []
    return {
      entered: results.length,
      total: subjects.length,
      complete: results.length === subjects.length,
    }
  }

  const calculateTotal = () => {
    let total = 0
    let maxTotal = 0
    subjects.forEach(subject => {
      if (scores[subject._id]) {
        total += Number(scores[subject._id])
      }
      maxTotal += subject.maxScore
    })
    return { total, maxTotal }
  }

  const totals = calculateTotal()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl font-bold">
            Enter Exam Scores
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Enter scores for "{categoryName}" - Only scores, no grades
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-4">
          <div className="w-1/3 border-r border-slate-200 pr-4 flex flex-col">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3 border-slate-200 focus:border-emerald-500"
            />
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredStudents.map((student) => {
                const progress = getStudentProgress(student.studentId)
                return (
                  <div
                    key={student._id}
                    onClick={() => setSelectedStudent(student)}
                    className={`p-3 rounded-xl cursor-pointer border transition-all ${
                      selectedStudent?._id === student._id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        {student.studentImage ? (
                          <img src={student.studentImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{student.studentName}</p>
                        <p className="text-xs text-slate-500">{student.registrationNumber}</p>
                      </div>
                      {progress.complete ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <span className="text-xs text-slate-400 flex-shrink-0">
                          {progress.entered}/{progress.total}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
              {filteredStudents.length === 0 && (
                <p className="text-center text-slate-500 py-4 text-sm">No approved students found</p>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedStudent ? (
              <>
                <div className="bg-emerald-50 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {selectedStudent.studentImage ? (
                        <img src={selectedStudent.studentImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-emerald-800">{selectedStudent.studentName}</p>
                      <p className="text-sm text-emerald-600 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {selectedStudent.registrationNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3">
                  {subjects.map((subject) => (
                    <div key={subject._id} className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{subject.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max={subject.maxScore}
                          placeholder="0"
                          value={scores[subject._id] || ""}
                          onChange={(e) => handleScoreChange(subject._id, e.target.value)}
                          className="w-20 text-center border-slate-200 focus:border-emerald-500"
                        />
                        <span className="text-slate-500 text-sm w-12">/ {subject.maxScore}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-slate-700">Total Score</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {totals.total} / {totals.maxTotal}
                    </span>
                  </div>
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full ${
                      saved 
                        ? "bg-emerald-600 hover:bg-emerald-600"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    } text-white shadow-md`}
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                    ) : saved ? (
                      <><CheckCircle className="w-4 h-4 mr-2" /> Saved</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" /> Save Scores</>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <User className="w-12 h-12 mx-auto mb-2" />
                  <p>Select a student to enter scores</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
