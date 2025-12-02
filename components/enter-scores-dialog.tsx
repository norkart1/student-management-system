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
  passMarks?: number
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
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl w-[95vw] max-w-4xl max-h-[85vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-slate-800 text-lg sm:text-xl font-bold">
            Enter Exam Scores
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Enter scores for "{categoryName}" - Select a subject, then enter scores for all students
          </DialogDescription>
        </DialogHeader>

        <div className="bg-slate-50 rounded-xl p-3 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-slate-600">Overall Progress</span>
            <span className="text-xs sm:text-sm font-medium text-emerald-600">
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

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-3 md:gap-4 min-h-0">
          <div className="md:w-1/3 md:border-r border-slate-200 md:pr-4 flex flex-col shrink-0">
            <p className="text-sm font-medium text-slate-700 mb-2">Subjects</p>
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible md:overflow-y-auto pb-2 md:pb-0 md:flex-1">
              {subjects.map((subject) => {
                const subjectProgress = getSubjectProgress(subject._id)
                return (
                  <div
                    key={subject._id}
                    onClick={() => setSelectedSubject(subject)}
                    className={`p-2 sm:p-3 rounded-xl cursor-pointer border transition-all shrink-0 ${
                      selectedSubject?._id === subject._id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
                        subjectProgress.complete ? "bg-emerald-100" : "bg-slate-100"
                      }`}>
                        <GraduationCap className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          subjectProgress.complete ? "text-emerald-600" : "text-slate-400"
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{subject.name}</p>
                        <p className="text-xs text-slate-500">Max: {subject.maxScore} | Pass: {subject.passMarks ?? Math.round(subject.maxScore * 0.25)}</p>
                      </div>
                      <div className="shrink-0 ml-auto hidden sm:block">
                        {subjectProgress.complete ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                        ) : (
                          <span className="text-xs text-slate-400">
                            {subjectProgress.entered}/{subjectProgress.total}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {subjects.length === 0 && (
                <p className="text-center text-slate-500 py-4 text-sm">No subjects added</p>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {selectedSubject ? (
              <>
                <div className="bg-emerald-50 rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-emerald-800 text-sm sm:text-base truncate">{selectedSubject.name}</p>
                      <p className="text-xs sm:text-sm text-emerald-600">Max: {selectedSubject.maxScore} | Pass: {selectedSubject.passMarks ?? Math.round(selectedSubject.maxScore * 0.25)}</p>
                    </div>
                  </div>
                </div>

                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2 sm:mb-3 border-slate-200 focus:border-emerald-500 text-sm shrink-0"
                />

                <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                  {filteredStudents.map((student) => {
                    const scoreValue = allScores[student.studentId]?.[selectedSubject._id]
                    const score = scoreValue !== undefined && scoreValue !== "" ? Number(scoreValue) : null
                    const passMarks = selectedSubject.passMarks ?? Math.round(selectedSubject.maxScore * 0.25)
                    const isFailing = score !== null && score < passMarks
                    const isPassing = score !== null && score >= passMarks
                    
                    return (
                      <div 
                        key={student._id} 
                        className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border rounded-xl ${
                          isFailing 
                            ? "border-red-300 bg-red-50" 
                            : isPassing 
                              ? "border-emerald-300 bg-emerald-50/50" 
                              : "border-slate-200"
                        }`}
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                          {student.studentImage ? (
                            <img src={student.studentImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 text-xs sm:text-sm truncate">{student.studentName}</p>
                          <p className="text-xs text-slate-500 truncate">{student.registrationNumber}</p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                          <Input
                            type="number"
                            min="0"
                            max={selectedSubject.maxScore}
                            placeholder="0"
                            value={scoreValue || ""}
                            onChange={(e) => handleScoreChange(student.studentId, selectedSubject._id, e.target.value)}
                            className={`w-14 sm:w-20 text-center text-sm px-1 sm:px-2 ${
                              isFailing 
                                ? "border-red-400 bg-red-100 text-red-700 focus:border-red-500" 
                                : isPassing 
                                  ? "border-emerald-400 text-emerald-700 focus:border-emerald-500" 
                                  : "border-slate-200 focus:border-emerald-500"
                            }`}
                          />
                          <div className="text-right min-w-[3.5rem]">
                            <span className="text-slate-500 text-xs sm:text-sm whitespace-nowrap">/ {selectedSubject.maxScore}</span>
                            {isFailing && <span className="block text-xs text-red-600 font-medium">FAIL</span>}
                            {isPassing && <span className="block text-xs text-emerald-600 font-medium">PASS</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {filteredStudents.length === 0 && (
                    <p className="text-center text-slate-500 py-4 text-sm">No students found</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
                  <p className="text-sm">Select a subject to enter scores</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 sm:pt-4 border-t border-slate-100 gap-2 sm:gap-3 shrink-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 order-2 sm:order-1"
          >
            Close
          </Button>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 order-1 sm:order-2">
            <Button 
              onClick={handleSaveAll}
              disabled={saving}
              className={`${
                saved 
                  ? "bg-emerald-600 hover:bg-emerald-600" 
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              } text-white shadow-md text-sm sm:text-base`}
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : saved ? (
                <><CheckCircle className="w-4 h-4 mr-2" /> Saved</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save All Scores</>
              )}
            </Button>
            
            {onPublish && serverProgress.allSaved && (
              <Button 
                onClick={handlePublish}
                disabled={publishing}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md text-sm sm:text-base"
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
