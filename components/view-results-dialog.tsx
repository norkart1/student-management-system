"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, BookOpen, Hash, Target, Search, Trophy, TrendingUp, TrendingDown, Users } from "lucide-react"

interface Exam {
  _id: string
  name: string
  subject: string
  totalMarks: number
  passingMarks: number
}

interface Result {
  _id: string
  studentId: string
  studentName: string
  marksObtained: number
  percentage: number
  grade: string
  passed: boolean
  remarks?: string
}

interface ViewResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exam: Exam | null
  results: Result[]
}

export function ViewResultsDialog({ open, onOpenChange, exam, results }: ViewResultsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")

  if (!exam) return null

  const filteredResults = results.filter(result =>
    result.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalStudents = results.length
  const passedStudents = results.filter(r => r.passed).length
  const failedStudents = totalStudents - passedStudents
  const passPercentage = totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 100) : 0
  const averageMarks = totalStudents > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.marksObtained, 0) / totalStudents * 100) / 100
    : 0
  const highestMarks = totalStudents > 0 
    ? Math.max(...results.map(r => r.marksObtained))
    : 0
  const lowestMarks = totalStudents > 0 
    ? Math.min(...results.map(r => r.marksObtained))
    : 0

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "bg-emerald-100 text-emerald-700"
      case "A": return "bg-green-100 text-green-700"
      case "B+": return "bg-blue-100 text-blue-700"
      case "B": return "bg-cyan-100 text-cyan-700"
      case "C": return "bg-yellow-100 text-yellow-700"
      case "D": return "bg-orange-100 text-orange-700"
      case "F": return "bg-red-100 text-red-700"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl font-bold">
            Exam Results
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            View all results for this exam
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
              <span className="font-medium text-slate-700">Total Marks:</span>
              <span className="text-slate-600">{exam.totalMarks}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-slate-700">Passing:</span>
              <span className="text-slate-600">{exam.passingMarks}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-700">{totalStudents}</p>
            <p className="text-xs text-blue-600">Total Students</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-700">{passedStudents}</p>
            <p className="text-xs text-green-600">Passed ({passPercentage}%)</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-700">{failedStudents}</p>
            <p className="text-xs text-red-600">Failed</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <Trophy className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-700">{averageMarks}</p>
            <p className="text-xs text-amber-600">Average Marks</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-600">
            Highest: <span className="font-medium text-green-600">{highestMarks}</span>
          </span>
          <span className="text-slate-600">
            Lowest: <span className="font-medium text-red-600">{lowestMarks}</span>
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="flex-1 overflow-auto border border-slate-200 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-700">Rank</TableHead>
                <TableHead className="font-semibold text-slate-700">Student</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Marks</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Percentage</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Grade</TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length > 0 ? (
                [...filteredResults]
                  .sort((a, b) => b.marksObtained - a.marksObtained)
                  .map((result, index) => (
                    <TableRow key={result._id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-600">
                        {index + 1}
                        {index === 0 && <Trophy className="w-4 h-4 text-amber-500 inline ml-1" />}
                      </TableCell>
                      <TableCell className="font-medium text-slate-700">{result.studentName}</TableCell>
                      <TableCell className="text-center text-slate-600">
                        {result.marksObtained}/{exam.totalMarks}
                      </TableCell>
                      <TableCell className="text-center text-slate-600">{result.percentage}%</TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.passed 
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {result.passed ? "Passed" : "Failed"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    {results.length === 0 ? "No results entered yet" : "No matching students found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end pt-2">
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
