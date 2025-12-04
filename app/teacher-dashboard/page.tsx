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
  CheckCircle2,
  AlertCircle,
  Megaphone,
  CalendarDays,
  Loader2,
  BookMarked
} from "lucide-react"

interface TeacherData {
  id: string
  fullName: string
  email: string
  phone: string
  username: string
  plainPassword: string
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

interface Notification {
  _id: string
  title: string
  content: string
  type: "general" | "exam" | "event" | "urgent"
  pinned: boolean
  createdAt: string
  isNew: boolean
}

interface Book {
  _id: string
  title: string
  author: string
  isbn?: string
  imageUrl?: string
  classNumbers?: number[]
}

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<TeacherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [bookSearchQuery, setBookSearchQuery] = useState("")
  const [editingStudent, setEditingStudent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ fullName: "", email: "", phone: "", dateOfBirth: "" })
  const [saving, setSaving] = useState(false)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("teacher_token")
    const storedData = localStorage.getItem("teacher_data")

    if (!token || !storedData) {
      router.push("/teacher-login")
      return
    }

    fetchTeacherProfile(token)
    fetchStudents()
    fetchNotifications()
    fetchBooks()

    const notificationInterval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(notificationInterval)
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
    const token = localStorage.getItem("teacher_token")
    if (!token) {
      handleLogout()
      return
    }
    
    try {
      const res = await fetch("/api/teachers/my-students", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch (error) {
      console.error("Failed to fetch students:", error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?role=teacher&limit=10")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books")
      if (res.ok) {
        const data = await res.json()
        setBooks(data)
      }
    } catch (error) {
      console.error("Failed to fetch books:", error)
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "exam":
        return <GraduationCap className="w-4 h-4 text-purple-500" />
      case "event":
        return <CalendarDays className="w-4 h-4 text-blue-500" />
      default:
        return <Megaphone className="w-4 h-4 text-emerald-500" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-50 border-red-200"
      case "exam":
        return "bg-purple-50 border-purple-200"
      case "event":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-emerald-50 border-emerald-200"
    }
  }

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registrationNumber?.includes(searchQuery) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
      b.isbn?.includes(bookSearchQuery)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-slate-800 text-sm sm:text-base block truncate">Teacher Dashboard</span>
                <span className="text-xs text-slate-500 hidden sm:block">Bright Future Academy</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/teacher-dashboard/profile" className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 overflow-hidden ring-2 ring-emerald-200 flex-shrink-0">
                    {teacher?.imageUrl ? (
                      <Image
                        src={teacher.imageUrl}
                        alt={teacher.fullName}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">
                    {teacher?.fullName}
                  </span>
                </Link>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-slate-500 text-sm">Welcome back</p>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            {teacher?.fullName.split(" ")[0]}'s Dashboard
          </h1>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700">{successMessage}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800">My Students</CardTitle>
                    <p className="text-sm text-slate-500">{students.length} students in your classes</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, registration number, or email..."
                  className="pl-10 h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                />
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">
                      {searchQuery ? "No students found" : "No students in your assigned classes"}
                    </p>
                    {!searchQuery && (
                      <p className="text-xs text-slate-400 mt-1">
                        Students will appear here once you are assigned to a class
                      </p>
                    )}
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
                              <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden flex-shrink-0">
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
                                    <User className="w-5 h-5 text-emerald-600" />
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
                                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
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
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">Notifications</CardTitle>
                      {notifications.filter(n => n.isNew).length > 0 && (
                        <span className="text-xs text-amber-600 font-medium">
                          {notifications.filter(n => n.isNew).length} new
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-3 rounded-lg border ${getNotificationBg(notification.type)} ${
                          notification.isNew ? "ring-2 ring-offset-1 ring-amber-300" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-slate-800 text-sm truncate">
                                {notification.title}
                              </h4>
                              {notification.isNew && (
                                <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] rounded-full font-medium">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                              {notification.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-slate-800">My Account</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span className="text-slate-600">{teacher?.email}</span>
                  </div>
                  {teacher?.username && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-emerald-500" />
                      <span className="text-slate-600">@{teacher.username}</span>
                    </div>
                  )}
                </div>
                <Link
                  href="/teacher-dashboard/profile"
                  className="mt-4 block w-full text-center py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  View My Profile
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <BookMarked className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-800">Library Books</CardTitle>
                  <p className="text-sm text-slate-500">{books.length} books available</p>
                </div>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={bookSearchQuery}
                  onChange={(e) => setBookSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  className="pl-10 h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">
                  {bookSearchQuery ? "No books found" : "No books in the library"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book._id}
                    className="p-4 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {book.imageUrl ? (
                          <Image
                            src={book.imageUrl}
                            alt={book.title}
                            width={48}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <BookOpen className="w-6 h-6 text-purple-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-slate-800 text-sm line-clamp-2">
                          {book.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">{book.author}</p>
                        {book.isbn && (
                          <p className="text-xs text-slate-400 mt-1">ISBN: {book.isbn}</p>
                        )}
                        {book.classNumbers && book.classNumbers.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {book.classNumbers.slice(0, 3).map((num) => (
                              <span
                                key={num}
                                className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] rounded font-medium"
                              >
                                Class {num}
                              </span>
                            ))}
                            {book.classNumbers.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded">
                                +{book.classNumbers.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
