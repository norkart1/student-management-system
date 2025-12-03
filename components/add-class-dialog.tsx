"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit3, School } from "lucide-react"

interface AddClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ClassFormData) => void
  editData?: ClassFormData | null
}

interface ClassFormData {
  name: string
  description: string
  academicYear: string
  section: string | null
}

export function AddClassDialog({ open, onOpenChange, onSubmit, editData }: AddClassDialogProps) {
  const [formData, setFormData] = useState<ClassFormData>({
    name: "",
    description: "",
    academicYear: new Date().getFullYear().toString(),
    section: "",
  })

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        description: editData.description || "",
        academicYear: editData.academicYear || new Date().getFullYear().toString(),
        section: editData.section ?? "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        academicYear: new Date().getFullYear().toString(),
        section: "",
      })
    }
  }, [editData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-md border-slate-200 bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              {editData ? <Edit3 className="w-4 h-4 text-white" /> : <School className="w-4 h-4 text-white" />}
            </div>
            {editData ? "Edit Class" : "Add New Class"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">Class Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., 9th Class, Grade 10"
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section" className="text-slate-700">Section</Label>
              <Input
                id="section"
                value={formData.section || ""}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g., A, B, C"
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="academicYear" className="text-slate-700">Academic Year</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="e.g., 2025"
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              {editData ? "Update Class" : "Add Class"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
