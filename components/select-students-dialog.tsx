"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, User, Hash, Loader2, Users, Check } from "lucide-react"
import { getAuthToken } from "@/lib/auth"

interface Student {
  _id: string
  name: string
  registrationNumber: string
  imageUrl?: string
}

interface SelectStudentsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string
  categoryName: string
  selectedStudentIds: string[]
  onSave: (studentIds: string[]) => Promise<void>
}

export function SelectStudentsDialog({ 
  open, 
  onOpenChange, 
  categoryId,
  categoryName,
  selectedStudentIds,
  onSave,
}: SelectStudentsDialogProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedStudentIds))
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      fetchStudents()
      setSelected(new Set(selectedStudentIds))
    }
  }, [open, selectedStudentIds])

  const fetchStudents = async () => {
    setLoading(true)
    const token = getAuthToken()
    try {
      const response = await fetch("/api/students", {
        headers: { "Authorization": `Bearer ${token}` },
      })
      const data = await response.json()
      setStudents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStudent = (studentId: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelected(newSelected)
  }

  const toggleAll = () => {
    if (selected.size === filteredStudents.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredStudents.map(s => s._id)))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(Array.from(selected))
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(search.toLowerCase()) ||
    student.registrationNumber?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Select Students
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Choose students for "{categoryName}"
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
          />
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={filteredStudents.length > 0 && selected.size === filteredStudents.length}
              onCheckedChange={toggleAll}
              className="border-slate-300"
            />
            <span className="text-sm text-slate-600">
              {selected.size} of {students.length} selected
            </span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 min-h-[200px] max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="ml-2 text-slate-500">Loading students...</span>
            </div>
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div 
                key={student._id} 
                className={`border rounded-xl p-3 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                  selected.has(student._id) 
                    ? "border-emerald-300 bg-emerald-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => toggleStudent(student._id)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={selected.has(student._id)}
                    onCheckedChange={() => toggleStudent(student._id)}
                    className="border-slate-300"
                  />
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    {student.imageUrl ? (
                      <img src={student.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{student.name}</p>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Hash className="w-3 h-3" />
                      <span>{student.registrationNumber}</span>
                    </div>
                  </div>
                </div>
                {selected.has(student._id) && (
                  <Check className="w-5 h-5 text-emerald-600" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>{search ? "No students match your search" : "No students found"}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Selection ({selected.size})
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
