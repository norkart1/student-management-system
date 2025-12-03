"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { getAuthToken } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddClassDialog } from "@/components/add-class-dialog"
import { AssignMembersDialog } from "@/components/assign-members-dialog"
import { AssignBooksDialog } from "@/components/assign-books-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { Spinner } from "@/components/spinner"
import { 
  School, 
  Plus, 
  Users, 
  GraduationCap, 
  Edit3, 
  Trash2,
  Calendar,
  MoreVertical,
  UserPlus,
  BookOpen
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ClassData {
  _id: string
  name: string
  description: string
  academicYear: string
  section: string | null
  studentIds: string[]
  teacherIds: string[]
  bookIds: string[]
  students: any[]
  teachers: any[]
  books: any[]
  studentCount: number
  teacherCount: number
  bookCount: number
  createdAt: string
}

interface Member {
  _id: string
  fullName: string
  email: string
  registrationNumber?: string
  imageUrl?: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([])
  const [students, setStudents] = useState<Member[]>([])
  const [teachers, setTeachers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [assignStudentsOpen, setAssignStudentsOpen] = useState(false)
  const [assignTeachersOpen, setAssignTeachersOpen] = useState(false)
  const [assignBooksOpen, setAssignBooksOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [classToDelete, setClassToDelete] = useState<ClassData | null>(null)
  const [classToEdit, setClassToEdit] = useState<ClassData | null>(null)
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [classesRes, studentsRes, teachersRes] = await Promise.all([
        fetch("/api/classes"),
        fetch("/api/students"),
        fetch("/api/teachers")
      ])
      
      const classesData = await classesRes.json()
      const studentsData = await studentsRes.json()
      const teachersData = await teachersRes.json()
      
      setClasses(classesData)
      setStudents(studentsData)
      setTeachers(teachersData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClass = async (formData: any) => {
    const token = getAuthToken()
    try {
      if (classToEdit) {
        const response = await fetch(`/api/classes/${classToEdit._id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          setClassToEdit(null)
          fetchData()
        }
      } else {
        const response = await fetch("/api/classes", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          fetchData()
        }
      }
    } catch (error) {
      console.error("Error saving class:", error)
    }
  }

  const handleAssignStudents = async (studentIds: string[]) => {
    if (!selectedClass) return
    
    const token = getAuthToken()
    setSaving(true)
    try {
      const response = await fetch(`/api/classes/${selectedClass._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ studentIds }),
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error assigning students:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleAssignTeachers = async (teacherIds: string[]) => {
    if (!selectedClass) return
    
    const token = getAuthToken()
    setSaving(true)
    try {
      const response = await fetch(`/api/classes/${selectedClass._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ teacherIds }),
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error assigning teachers:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleEditClick = (classData: ClassData) => {
    setClassToEdit(classData)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setClassToEdit(null)
    }
  }

  const handleDeleteClick = (classData: ClassData) => {
    setClassToDelete(classData)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!classToDelete) return
    
    const token = getAuthToken()
    setDeleting(true)
    try {
      const response = await fetch(`/api/classes/${classToDelete._id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      if (response.ok) {
        setDeleteDialogOpen(false)
        setClassToDelete(null)
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting class:", error)
    } finally {
      setDeleting(false)
    }
  }

  const openAssignStudents = (classData: ClassData) => {
    setSelectedClass(classData)
    setAssignStudentsOpen(true)
  }

  const openAssignTeachers = (classData: ClassData) => {
    setSelectedClass(classData)
    setAssignTeachersOpen(true)
  }

  const openAssignBooks = (classData: ClassData) => {
    setSelectedClass(classData)
    setAssignBooksOpen(true)
  }

  const handleAssignBooks = async (bookIds: string[]) => {
    if (!selectedClass) return
    
    const token = getAuthToken()
    setSaving(true)
    try {
      const response = await fetch(`/api/classes/${selectedClass._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ bookIds }),
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error assigning books:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner message="Loading classes..." />
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="p-6 md:p-8 lg:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <School className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Classes</h1>
              <p className="text-slate-500 text-sm md:text-base">Manage class registrations</p>
            </div>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </Button>
        </div>

        {classes.length === 0 ? (
          <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <School className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Classes Yet</h3>
              <p className="text-slate-500 text-center mb-6 max-w-sm">
                Create your first class to start organizing students and teachers.
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Add First Class
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classData) => (
              <Card key={classData._id} className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                        <School className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-800">
                          {classData.name}
                          {classData.section && <span className="text-emerald-600"> - {classData.section}</span>}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {classData.academicYear}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onSelect={() => handleEditClick(classData)} className="gap-2">
                          <Edit3 className="w-4 h-4" />
                          Edit Class
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => openAssignStudents(classData)} className="gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Manage Students
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => openAssignTeachers(classData)} className="gap-2">
                          <Users className="w-4 h-4" />
                          Manage Teachers
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => openAssignBooks(classData)} className="gap-2">
                          <BookOpen className="w-4 h-4" />
                          Manage Books
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onSelect={() => handleDeleteClick(classData)} 
                          className="gap-2 text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {classData.description && (
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{classData.description}</p>
                  )}
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => openAssignStudents(classData)}
                      className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors group"
                    >
                      <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-base font-bold text-emerald-700">{classData.studentCount || 0}</p>
                        <p className="text-xs text-emerald-600">Students</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => openAssignTeachers(classData)}
                      className="flex items-center gap-2 p-2 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors group"
                    >
                      <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-base font-bold text-teal-700">{classData.teacherCount || 0}</p>
                        <p className="text-xs text-teal-600">Teachers</p>
                      </div>
                    </button>

                    <button
                      onClick={() => openAssignBooks(classData)}
                      className="flex items-center gap-2 p-2 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                    >
                      <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-base font-bold text-purple-700">{classData.bookCount || 0}</p>
                        <p className="text-xs text-purple-600">Books</p>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddClassDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={handleAddClass}
        editData={classToEdit}
      />

      <AssignMembersDialog
        open={assignStudentsOpen}
        onOpenChange={setAssignStudentsOpen}
        title={`Assign Students to ${selectedClass?.name || "Class"}`}
        type="students"
        members={students}
        selectedIds={selectedClass?.studentIds?.map(id => id.toString()) || []}
        onSubmit={handleAssignStudents}
        loading={saving}
      />

      <AssignMembersDialog
        open={assignTeachersOpen}
        onOpenChange={setAssignTeachersOpen}
        title={`Assign Teachers to ${selectedClass?.name || "Class"}`}
        type="teachers"
        members={teachers}
        selectedIds={selectedClass?.teacherIds?.map(id => id.toString()) || []}
        onSubmit={handleAssignTeachers}
        loading={saving}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Class"
        description={`Are you sure you want to delete "${classToDelete?.name}"? This will remove all student and teacher assignments but won't delete the actual students or teachers.`}
        loading={deleting}
      />

      <AssignBooksDialog
        open={assignBooksOpen}
        onOpenChange={setAssignBooksOpen}
        title={`Assign Books to ${selectedClass?.name || "Class"}`}
        selectedBookIds={selectedClass?.bookIds?.map(id => id.toString()) || []}
        onSubmit={handleAssignBooks}
        loading={saving}
      />
    </ProtectedLayout>
  )
}
