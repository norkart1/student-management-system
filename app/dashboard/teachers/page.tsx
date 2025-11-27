"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { Spinner } from "@/components/spinner"
import { Users } from "lucide-react"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
    experience: "",
  })

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/teachers")
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error("Error fetching teachers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          qualification: "",
          experience: "",
        })
        setDialogOpen(false)
        fetchTeachers()
      }
    } catch (error) {
      console.error("Error adding teacher:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = (teacher: any) => {
    setTeacherToDelete(teacher)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/teachers/${teacherToDelete._id}`, { method: "DELETE" })
      if (response.ok) {
        setDeleteDialogOpen(false)
        setTeacherToDelete(null)
        fetchTeachers()
      } else {
        console.error("Failed to delete teacher")
      }
    } catch (error) {
      console.error("Error deleting teacher:", error)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    { key: "qualification", label: "Qualification" },
    { key: "experience", label: "Experience" },
  ]

  return (
    <ProtectedLayout>
      <div className="p-6 md:p-8 lg:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Users className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Teachers</h1>
              <p className="text-slate-500 text-sm md:text-base">Manage teacher profiles and details</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
              {teachers.length} Total Teachers
            </span>
          </div>
        </div>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-800 text-lg">All Teachers</CardTitle>
                <CardDescription className="text-slate-500">View and manage all teacher records</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner message="Loading teachers..." />
              </div>
            ) : (
              <DataTable columns={columns} data={teachers} onDelete={handleDeleteClick} onAdd={() => setDialogOpen(true)} />
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="border-[#CFF4D2]">
            <DialogHeader>
              <DialogTitle className="text-[#205072]">Add New Teacher</DialogTitle>
              <DialogDescription className="text-[#329D9C]">Fill in the teacher details</DialogDescription>
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
                <Label htmlFor="subject" className="text-[#205072]">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification" className="text-[#205072]">Qualification</Label>
                <Input
                  id="qualification"
                  placeholder="Enter qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-[#205072]">Years of Experience</Label>
                <Input
                  id="experience"
                  placeholder="Enter years of experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="border-[#CFF4D2] text-[#205072] hover:bg-[#CFF4D2]/30"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-gradient-to-r from-[#329D9C] to-[#56C596] hover:from-[#205072] hover:to-[#329D9C] text-white"
                >
                  {saving ? "Saving..." : "Save Teacher"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete Teacher"
          itemName={teacherToDelete ? `${teacherToDelete.firstName} ${teacherToDelete.lastName}` : undefined}
          loading={deleting}
        />
      </div>
    </ProtectedLayout>
  )
}
