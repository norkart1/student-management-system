"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/image-upload"
import { User, Mail, Phone, Calendar } from "lucide-react"
import { toTitleCase } from "@/lib/text-utils"

interface AddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  initialData?: any
}

export function AddStudentDialog({ open, onOpenChange, onSubmit, initialData }: AddStudentDialogProps) {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    dateOfBirth: initialData?.dateOfBirth || "",
    imageUrl: initialData?.imageUrl || "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          fullName: initialData.fullName || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          dateOfBirth: initialData.dateOfBirth || "",
          imageUrl: initialData.imageUrl || "",
        })
      } else {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          imageUrl: "",
        })
      }
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        imageUrl: "",
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
            {initialData ? "Edit Student" : "Add New Student"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Fill in the student details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            type="profile"
          />

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: toTitleCase(e.target.value) })}
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              placeholder="Select date of birth"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
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
              {loading ? "Saving..." : (initialData ? "Update Student" : "Save Student")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
