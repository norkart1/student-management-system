"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Hash, GraduationCap, Save, Loader2, CheckCircle, Send, ChevronRight } from "lucide-react"

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
  onRefresh?: () => Promise<void>
  onPublish?: () => Promise<void>
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
  onRefresh,
  onPublish,
}: EnterScoresDialogProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [allScores, setAllScores] = useState<Record<string, Record<string, string>>>({})
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      const initialScores: Record<string, Record<string, string>> = {}
      
      approvedStudents.forEach(student => {
        const studentResults = existingResults.get(student.studentId) || []
        initialScores[student.studentId] = {}
        
        subjects.forEach(subject => {
          const existingResult = studentResults.find(r => r.subjectId === subject._id)
          initialScores[student.studentId][subject._id] = existingResult ? String(existingResult.score) : ""
        })
      })
      
      setAllScores(initialScores)
      setSelectedSubject(subjects.length > 0 ? subjects[0] : null)
      setSearchTerm("")
      setSaved(false)
    }
  }, [open, subjects, approvedStudents, existingResults])

  const handleScoreChange = (studentId: string, subjectId: string, value: string) => {
    setAllScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subjectId]: value
      }
    }))
    setSaved(false)
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      for (const student of approvedStudents) {
        const studentScores = allScores[student.studentId] || {}
        const scoresArray = Object.entries(studentScores)
          .filter(([_, value]) => value !== "")
          .map(([subjectId, value]) => ({
            subjectId,
            score: Number(value),
          }))
        
        if (scoresArray.length > 0) {
          await onSaveScores(student.studentId, scoresArray)
        }
      }
      if (onRefresh) {
        await onRefresh()
      }
      setSaved(true)
    } catch (error) {
      console.error("Error saving scores:", error)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!onPublish) return
    setPublishing(true)
    try {
      await onPublish()
    } catch (error) {
      console.error("Error publishing:", error)
    } finally {
      setPublishing(false)
    }
  }

  const filteredStudents = approvedStudents.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSubjectProgress = (subjectId: string) => {
    let entered = 0
    approvedStudents.forEach(student => {
      const score = allScores[student.studentId]?.[subjectId]
      if (score !== undefined && score !== "") {
        entered++
      }
    })
    return {
      entered,
      total: approvedStudents.length,
      complete: entered === approvedStudents.length,
    }
  }

  const getAllProgress = () => {
    let totalRequired = subjects.length * approvedStudents.length
    let totalEntered = 0
    
    approvedStudents.forEach(student => {
      subjects.forEach(subject => {
        const score = allScores[student.studentId]?.[subject._id]
        if (score !== undefined && score !== "") {
          totalEntered++
        }
      })
    })
    
    return {
      entered: totalEntered,
      total: totalRequired,
      complete: totalEntered === totalRequired,
      percentage: totalRequired > 0 ? Math.round((totalEntered / totalRequired) * 100) : 0
    }
  }

  const getServerSavedProgress = () => {
    let totalRequired = subjects.length * approvedStudents.length
    let totalSaved = 0
    
    approvedStudents.forEach(student => {
      const studentResults = existingResults.get(student.studentId) || []
      subjects.forEach(subject => {
        const hasResult = studentResults.some(r => r.subjectId === subject._id)
        if (hasResult) {
          totalSaved++
        }
      })
    })
    
    return {
      saved: totalSaved,
      total: totalRequired,
      allSaved: totalSaved === totalRequired && totalRequired > 0
    }
  }

  const progress = getAllProgress()
  const serverProgress = getServerSavedProgress()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl font-bold">
            Enter Exam Scores
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Enter scores for "{categoryName}" - Select a subject, then enter scores for all students
          </DialogDescription>
        </DialogHeader>

        <div className="bg-slate-50 rounded-xl p-3 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Overall Progress</span>
            <span className="text-sm font-medium text-emerald-600">
              {progress.entered} / {progress.total} scores ({progress.percentage}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex gap-4">
          <div className="w-1/3 border-r border-slate-200 pr-4 flex flex-col">
            <p className="text-sm font-medium text-slate-700 mb-3">Subjects</p>
            <div className="flex-1 overflow-y-auto space-y-2">
              {subjects.map((subject) => {
                const subjectProgress = getSubjectProgress(subject._id)
                return (
                  <div
                    key={subject._id}
                    onClick={() => setSelectedSubject(subject)}
                    className={`p-3 rounded-xl cursor-pointer border transition-all ${
                      selectedSubject?._id === subject._id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        subjectProgress.complete ? "bg-emerald-100" : "bg-slate-100"
                      }`}>
                        <GraduationCap className={`w-5 h-5 ${
                          subjectProgress.complete ? "text-emerald-600" : "text-slate-400"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{subject.name}</p>
                        <p className="text-xs text-slate-500">Max: {subject.maxScore}</p>
                      </div>
                      {subjectProgress.complete ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <span className="text-xs text-slate-400 flex-shrink-0">
                          {subjectProgress.entered}/{subjectProgress.total}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
              {subjects.length === 0 && (
                <p className="text-center text-slate-500 py-4 text-sm">No subjects added</p>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedSubject ? (
              <>
                <div className="bg-emerald-50 rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-emerald-800">{selectedSubject.name}</p>
                      <p className="text-sm text-emerald-600">Max Score: {selectedSubject.maxScore}</p>
                    </div>
                  </div>
                </div>

                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-3 border-slate-200 focus:border-emerald-500"
                />

                <div className="flex-1 overflow-y-auto space-y-2">
                  {filteredStudents.map((student) => (
                    <div key={student._id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Input
                          type="number"
                          min="0"
                          max={selectedSubject.maxScore}
                          placeholder="0"
                          value={allScores[student.studentId]?.[selectedSubject._id] || ""}
                          onChange={(e) => handleScoreChange(student.studentId, selectedSubject._id, e.target.value)}
                          className="w-20 text-center border-slate-200 focus:border-emerald-500"
                        />
                        <span className="text-slate-500 text-sm w-12">/ {selectedSubject.maxScore}</span>
                      </div>
                    </div>
                  ))}
                  {filteredStudents.length === 0 && (
                    <p className="text-center text-slate-500 py-4 text-sm">No students found</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <GraduationCap className="w-12 h-12 mx-auto mb-2" />
                  <p>Select a subject to enter scores</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Close
          </Button>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSaveAll}
              disabled={saving}
              className={`${
                saved 
                  ? "bg-emerald-600 hover:bg-emerald-600" 
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              } text-white shadow-md`}
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving All...</>
              ) : saved ? (
                <><CheckCircle className="w-4 h-4 mr-2" /> All Scores Saved</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save All Scores</>
              )}
            </Button>
            
            {onPublish && serverProgress.allSaved && (
              <Button 
                onClick={handlePublish}
                disabled={publishing}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md"
              >
                {publishing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Publish Results</>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
