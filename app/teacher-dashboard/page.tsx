"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Users,
  GraduationCap,
  LogOut,
  User,
  Search,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  Calendar,
  Hash,
  ChevronDown,
  ChevronUp,
  Bell,
  BookOpen,
  CheckCircle2
} from "lucide-react"

interface TeacherData {
  id: string
  fullName: string
  email: string
  imageUrl: string | null
}

interface Student {
  _id: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  registrationNumber: string
  imageUrl: string | null
}

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<TeacherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingStudent, setEditingStudent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ fullName: "", email: "", phone: "", dateOfBirth: "" })
  const [saving, setSaving] = useState(false)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("teacher_token")
    const storedData = localStorage.getItem("teacher_data")

    if (!token || !storedData) {
      router.push("/teacher-login")
      return
    }

    fetchTeacherProfile(token)
    fetchStudents()
    fetchAnnouncements()
  }, [router])

  const fetchTeacherProfile = async (token: string) => {
    try {
      const res = await fetch("/api/teacher-auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        setTeacher(data)
        localStorage.setItem("teacher_data", JSON.stringify(data))
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students")
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      }
    } catch (error) {
      console.error("Failed to fetch students:", error)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements")
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data.slice(0, 3))
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("teacher_token")
    localStorage.removeItem("teacher_data")
    router.push("/teacher-login")
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student._id)
    setEditForm({
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth || ""
    })
    setExpandedStudent(student._id)
  }

  const handleCancelEdit = () => {
    setEditingStudent(null)
    setEditForm({ fullName: "", email: "", phone: "", dateOfBirth: "" })
  }

  const handleSaveStudent = async (studentId: string) => {
    const token = localStorage.getItem("teacher_token")
    if (!token) return

    setSaving(true)
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })

      if (res.ok) {
        await fetchStudents()
        setEditingStudent(null)
        setSuccessMessage("Student information updated successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (error) {
      console.error("Failed to update student:", error)
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registrationNumber?.includes(searchQuery) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-800">Teacher Dashboard</h1>
                <p className="text-xs text-slate-500">Bright Future Academy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                  {teacher?.imageUrl ? (
                    <Image
                      src={teacher.imageUrl}
                      alt={teacher.fullName}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                  {teacher?.fullName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-emerald-700">{successMessage}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800">Student Management</CardTitle>
                    <p className="text-sm text-slate-500">{students.length} students</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, registration number, or email..."
                  className="pl-10 border-slate-200"
                />
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No students found</p>
                  </div>
                ) : (
                  filteredStudents.map((student) => {
                    const isExpanded = expandedStudent === student._id
                    const isEditing = editingStudent === student._id

                    return (
                      <div
                        key={student._id}
                        className="border border-slate-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => setExpandedStudent(isExpanded ? null : student._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                {student.imageUrl ? (
                                  <Image
                                    src={student.imageUrl}
                                    alt={student.fullName}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-slate-800">{student.fullName}</h3>
                                <p className="text-sm text-slate-500">
                                  {student.registrationNumber || "No Reg #"} • {student.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!isEditing && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditStudent(student)
                                  }}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-slate-100 pt-4 bg-slate-50">
                            {isEditing ? (
                              <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-slate-600">Full Name</Label>
                                    <Input
                                      value={editForm.fullName}
                                      onChange={(e) =>
                                        setEditForm({ ...editForm, fullName: e.target.value })
                                      }
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-slate-600">Email</Label>
                                    <Input
                                      value={editForm.email}
                                      onChange={(e) =>
                                        setEditForm({ ...editForm, email: e.target.value })
                                      }
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-slate-600">Phone</Label>
                                    <Input
                                      value={editForm.phone}
                                      onChange={(e) =>
                                        setEditForm({ ...editForm, phone: e.target.value })
                                      }
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-slate-600">Date of Birth</Label>
                                    <Input
                                      type="date"
                                      value={editForm.dateOfBirth}
                                      onChange={(e) =>
                                        setEditForm({ ...editForm, dateOfBirth: e.target.value })
                                      }
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveStudent(student._id)}
                                    disabled={saving}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                  >
                                    {saving ? "Saving..." : (
                                      <>
                                        <Save className="w-4 h-4 mr-1" />
                                        Save Changes
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancelEdit}
                                    className="border-slate-300"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <Hash className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">Reg: {student.registrationNumber || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">{student.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">{student.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-600">
                                    {student.dateOfBirth
                                      ? new Date(student.dateOfBirth).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm rounded-2xl">
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-800">Announcements</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {announcements.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No announcements</p>
                ) : (
                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div key={ann._id} className="p-3 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-800 text-sm">{ann.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{ann.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm rounded-2xl">
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-800">Quick Stats</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Total Students</span>
                    <span className="font-bold text-slate-800">{students.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
