"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { AddStudentDialog } from "@/components/add-student-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { Spinner } from "@/components/spinner"
import { GraduationCap } from "lucide-react"

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async (formData: any) => {
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        fetchStudents()
      }
    } catch (error) {
      console.error("Error adding student:", error)
    }
  }

  const handleDeleteClick = (student: any) => {
    setStudentToDelete(student)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/students/${studentToDelete._id}`, { method: "DELETE" })
      if (response.ok) {
        setDeleteDialogOpen(false)
        setStudentToDelete(null)
        fetchStudents()
      } else {
        console.error("Failed to delete student")
      }
    } catch (error) {
      console.error("Error deleting student:", error)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "rollNumber", label: "Roll Number" },
    { key: "className", label: "Class" },
    { key: "section", label: "Section" },
  ]

  return (
    <ProtectedLayout>
      <div className="p-6 md:p-8 lg:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Students</h1>
              <p className="text-slate-500 text-sm md:text-base">Manage student information and records</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
              {students.length} Total Students
            </span>
          </div>
        </div>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-800 text-lg">All Students</CardTitle>
                <CardDescription className="text-slate-500">View and manage all student records</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner message="Loading students..." />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={students}
                onDelete={handleDeleteClick}
                onAdd={() => setDialogOpen(true)}
              />
            )}
          </CardContent>
        </Card>

        <AddStudentDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAddStudent} />
        
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete Student"
          itemName={studentToDelete ? `${studentToDelete.firstName} ${studentToDelete.lastName}` : undefined}
          loading={deleting}
        />
      </div>
    </ProtectedLayout>
  )
}
