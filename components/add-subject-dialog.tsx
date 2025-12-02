"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookOpen, Hash, Target } from "lucide-react"

interface AddSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  categoryName?: string
  initialData?: any
}

export function AddSubjectDialog({ open, onOpenChange, onSubmit, categoryName, initialData }: AddSubjectDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    maxScore: "100",
    passMarks: "25",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          maxScore: String(initialData.maxScore || 100),
          passMarks: String(initialData.passMarks || Math.round((initialData.maxScore || 100) * 0.25)),
        })
      } else {
        setFormData({
          name: "",
          maxScore: "100",
          passMarks: "25",
        })
      }
    }
  }, [initialData, open])

  const handleMaxScoreChange = (value: string) => {
    const maxScore = Number(value) || 100
    const suggestedPassMarks = Math.round(maxScore * 0.25)
    setFormData({ 
      ...formData, 
      maxScore: value,
      passMarks: String(suggestedPassMarks)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        ...formData,
        maxScore: Number(formData.maxScore),
        passMarks: Number(formData.passMarks),
      })
      setFormData({ name: "", maxScore: "100", passMarks: "25" })
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl font-bold">
            {initialData ? "Edit Subject" : "Add Subject"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {categoryName ? `Adding subject to "${categoryName}"` : "Add a subject to this exam category"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Subject Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Mathematics"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxScore" className="text-slate-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-600" />
                Maximum Score
              </Label>
              <Input
                id="maxScore"
                type="number"
                min="1"
                placeholder="100"
                value={formData.maxScore}
                onChange={(e) => handleMaxScoreChange(e.target.value)}
                required
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passMarks" className="text-slate-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Pass Marks
              </Label>
              <Input
                id="passMarks"
                type="number"
                min="0"
                max={formData.maxScore}
                placeholder="25"
                value={formData.passMarks}
                onChange={(e) => setFormData({ ...formData, passMarks: e.target.value })}
                required
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Pass marks auto-calculated as 25% of max score. Adjust as needed.
          </p>

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
              {loading ? "Saving..." : (initialData ? "Update Subject" : "Add Subject")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
