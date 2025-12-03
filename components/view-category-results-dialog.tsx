"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, User, Hash, Trophy, TrendingUp, TrendingDown } from "lucide-react"

interface Subject {
  _id: string
  name: string
  maxScore: number
  passMarks?: number
}

interface StudentResult {
  studentId: string
  studentName: string
  registrationNumber: string
  studentImage?: string
  scores: Record<string, number>
  totalScore: number
  maxTotalScore: number
  percentage: number
}

interface ViewCategoryResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryName: string
  subjects: Subject[]
  results: StudentResult[]
}

export function ViewCategoryResultsDialog({ 
  open, 
  onOpenChange, 
  categoryName,
  subjects,
  results,
}: ViewCategoryResultsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"rank" | "name" | "regNo">("rank")

  const sortedResults = useMemo(() => {
    let sorted = [...results]
    
    if (sortBy === "rank") {
      sorted.sort((a, b) => b.totalScore - a.totalScore)
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.studentName.localeCompare(b.studentName))
    } else if (sortBy === "regNo") {
      sorted.sort((a, b) => a.registrationNumber.localeCompare(b.registrationNumber))
    }

    return sorted.filter(r => 
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [results, sortBy, searchTerm])

  const stats = useMemo(() => {
    if (results.length === 0) return null
    
    const percentages = results.map(r => r.percentage)
    const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length
    const highest = Math.max(...percentages)
    const lowest = Math.min(...percentages)
    
    return { avg: avg.toFixed(1), highest: highest.toFixed(1), lowest: lowest.toFixed(1) }
  }, [results])

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl font-bold">
            Exam Results
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Results for "{categoryName}"
          </DialogDescription>
        </DialogHeader>

        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <Trophy className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-emerald-700">{stats.highest}%</p>
              <p className="text-xs text-emerald-600">Highest</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-700">{stats.avg}%</p>
              <p className="text-xs text-blue-600">Average</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <TrendingDown className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-orange-700">{stats.lowest}%</p>
              <p className="text-xs text-orange-600">Lowest</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200 focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            {(["rank", "name", "regNo"] as const).map((sort) => (
              <Button
                key={sort}
                variant={sortBy === sort ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(sort)}
                className={sortBy === sort 
                  ? "bg-emerald-600 text-white" 
                  : "border-slate-200 text-slate-600"
                }
              >
                {sort === "rank" ? "By Rank" : sort === "name" ? "By Name" : "By Reg. No"}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Student</th>
                {subjects.map(subject => (
                  <th key={subject._id} className="text-center py-3 px-3 text-sm font-medium text-slate-600">
                    <div>{subject.name}</div>
                    <div className="text-xs text-slate-400 font-normal">Max: {subject.maxScore} | Pass: {subject.passMarks ?? Math.round(subject.maxScore * 0.25)}</div>
                  </th>
                ))}
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Total</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">%</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result, index) => {
                const rank = sortBy === "rank" ? index + 1 : 
                  results.filter(r => r.totalScore > result.totalScore).length + 1
                return (
                  <tr key={result.studentId} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        rank === 1 ? "bg-yellow-100 text-yellow-700" :
                        rank === 2 ? "bg-slate-200 text-slate-700" :
                        rank === 3 ? "bg-orange-100 text-orange-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {rank}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                          {result.studentImage ? (
                            <img src={result.studentImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{result.studentName}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {result.registrationNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    {subjects.map(subject => {
                      const score = result.scores[subject._id]
                      const passMarks = subject.passMarks ?? Math.round(subject.maxScore * 0.25)
                      const isPassing = score !== undefined && score >= passMarks
                      const isFailing = score !== undefined && score < passMarks
                      return (
                        <td key={subject._id} className="text-center py-3 px-3">
                          <span className={`font-medium ${
                            score === undefined ? "text-slate-400" :
                            isPassing ? "text-emerald-600" : "text-red-600"
                          }`}>
                            {score ?? "-"}
                            {isFailing && <span className="text-xs ml-1">(F)</span>}
                          </span>
                        </td>
                      )
                    })}
                    <td className="text-center py-3 px-4">
                      <span className="font-bold text-slate-800">
                        {result.totalScore}/{result.maxTotalScore}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-bold ${
                        result.percentage >= 80 ? "text-emerald-600" :
                        result.percentage >= 60 ? "text-blue-600" :
                        result.percentage >= 40 ? "text-orange-600" :
                        "text-red-600"
                      }`}>
                        {result.percentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {sortedResults.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Trophy className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No results found</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-500">
            Showing {sortedResults.length} of {results.length} students
          </span>
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
