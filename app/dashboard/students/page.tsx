"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { AddStudentDialog } from "@/components/add-student-dialog"

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

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

  const handleDeleteStudent = async (student: any) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await fetch(`/api/students/${student._id}`, { method: "DELETE" })
        fetchStudents()
      } catch (error) {
        console.error("Error deleting student:", error)
      }
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
        <div>
          <h1 className="text-3xl font-bold">Students Management</h1>
          <p className="text-muted-foreground">Manage student information and records</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>Total: {students.length} students</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <DataTable
                columns={columns}
                data={students}
                onDelete={handleDeleteStudent}
                onAdd={() => setDialogOpen(true)}
              />
            )}
          </CardContent>
        </Card>

        <AddStudentDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAddStudent} />
      </div>
    </ProtectedLayout>
  )
}
