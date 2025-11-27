"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  initialData?: any
}

export function AddStudentDialog({ open, onOpenChange, onSubmit, initialData }: AddStudentDialogProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    rollNumber: initialData?.rollNumber || "",
    className: initialData?.className || "",
    section: initialData?.section || "",
    dateOfBirth: initialData?.dateOfBirth || "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        rollNumber: "",
        className: "",
        section: "",
        dateOfBirth: "",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#CFF4D2]">
        <DialogHeader>
          <DialogTitle className="text-[#205072]">
            {initialData ? "Edit Student" : "Add New Student"}
          </DialogTitle>
          <DialogDescription className="text-[#329D9C]">
            Fill in the student details below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[#205072]">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[#205072]">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#205072]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#205072]">Phone</Label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollNumber" className="text-[#205072]">Roll Number</Label>
            <Input
              id="rollNumber"
              placeholder="Enter roll number"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="className" className="text-[#205072]">Class</Label>
              <Input
                id="className"
                placeholder="Enter class"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section" className="text-[#205072]">Section</Label>
              <Input
                id="section"
                placeholder="Enter section"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-[#205072]">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-[#CFF4D2] text-[#205072] hover:bg-[#CFF4D2]/30"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-[#329D9C] to-[#56C596] hover:from-[#205072] hover:to-[#329D9C] text-white"
            >
              {loading ? "Saving..." : "Save Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
