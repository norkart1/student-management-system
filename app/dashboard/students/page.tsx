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
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#329D9C] to-[#56C596] rounded-2xl flex items-center justify-center shadow-lg shadow-[#329D9C]/30">
            <GraduationCap className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#205072]">Students Management</h1>
            <p className="text-[#329D9C]">Manage student information and records</p>
          </div>
        </div>

        <Card className="border border-[#CFF4D2] bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#205072]">All Students</CardTitle>
            <CardDescription className="text-[#329D9C]">Total: {students.length} students</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
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
