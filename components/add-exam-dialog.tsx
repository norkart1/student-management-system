"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, BookOpen, Calendar, Hash, Target, AlignLeft } from "lucide-react"

interface AddExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  initialData?: any
}

export function AddExamDialog({ open, onOpenChange, onSubmit, initialData }: AddExamDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    date: "",
    totalMarks: "100",
    passingMarks: "40",
    description: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          subject: initialData.subject || "",
          date: initialData.date ? initialData.date.split("T")[0] : "",
          totalMarks: String(initialData.totalMarks || 100),
          passingMarks: String(initialData.passingMarks || 40),
          description: initialData.description || "",
        })
      } else {
        setFormData({
          name: "",
          subject: "",
          date: "",
          totalMarks: "100",
          passingMarks: "40",
          description: "",
        })
      }
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        ...formData,
        totalMarks: Number(formData.totalMarks),
        passingMarks: Number(formData.passingMarks),
      })
      setFormData({
        name: "",
        subject: "",
        date: "",
        totalMarks: "100",
        passingMarks: "40",
        description: "",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl font-bold">
            {initialData ? "Edit Exam" : "Add New Exam"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Fill in the exam details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Exam Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Mid-Term Examination"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="e.g., Mathematics"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Exam Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalMarks" className="text-slate-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-600" />
                Total Marks
              </Label>
              <Input
                id="totalMarks"
                type="number"
                min="1"
                placeholder="100"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                required
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingMarks" className="text-slate-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Passing Marks
              </Label>
              <Input
                id="passingMarks"
                type="number"
                min="0"
                placeholder="40"
                value={formData.passingMarks}
                onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
                required
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-emerald-600" />
              Description (Optional)
            </Label>
            <Input
              id="description"
              placeholder="Brief description about the exam"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md"
            >
              {loading ? "Saving..." : (initialData ? "Update Exam" : "Create Exam")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
