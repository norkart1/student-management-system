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
import { ReportDropdown } from "@/components/report-dropdown"
import { Spinner } from "@/components/spinner"
import { ImageUpload } from "@/components/image-upload"
import { Users, User, Mail, Phone } from "lucide-react"
import { toTitleCase } from "@/lib/text-utils"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    imageUrl: "",
  })
  const [teacherToEdit, setTeacherToEdit] = useState<any>(null)

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
      if (teacherToEdit) {
        const response = await fetch(`/api/teachers/${teacherToEdit._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          resetForm()
          setDialogOpen(false)
          fetchTeachers()
        }
      } else {
        const response = await fetch("/api/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          resetForm()
          setDialogOpen(false)
          fetchTeachers()
        }
      }
    } catch (error) {
      console.error("Error saving teacher:", error)
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      imageUrl: "",
    })
    setTeacherToEdit(null)
  }

  const handleEditClick = (teacher: any) => {
    setTeacherToEdit(teacher)
    setFormData({
      fullName: teacher.fullName || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      imageUrl: teacher.imageUrl || "",
    })
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      resetForm()
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
    { key: "imageUrl", label: "Photo", type: "image" as const },
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
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
          <div className="flex items-center gap-3">
            <ReportDropdown
              data={teachers}
              columns={columns}
              type="teachers"
              title="Teachers"
            />
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium text-sm">
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
              <DataTable columns={columns} data={teachers} onEdit={handleEditClick} onDelete={handleDeleteClick} onAdd={() => setDialogOpen(true)} reportType="teachers" />
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-slate-800 text-xl font-bold">
                {teacherToEdit ? "Edit Teacher" : "Add New Teacher"}
              </DialogTitle>
              <DialogDescription className="text-slate-500">Fill in the teacher details</DialogDescription>
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

              <div className="flex gap-3 justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md"
                >
                  {saving ? "Saving..." : (teacherToEdit ? "Update Teacher" : "Save Teacher")}
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
          itemName={teacherToDelete?.fullName}
          loading={deleting}
        />
      </div>
    </ProtectedLayout>
  )
}
