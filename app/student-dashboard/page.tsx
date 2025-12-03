"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogOut,
  User,
  School,
  Bell,
  Loader2,
  ArrowRight,
  BookMarked,
  ClipboardList
} from "lucide-react"

interface StudentData {
  id: string
  fullName: string
  email: string
  phone: string
  imageUrl: string | null
  profileCompleted: boolean
  admissionStatus: "pending" | "approved" | "rejected"
  approvedClass: number | null
  classDetails?: any
  enrolledBooks?: any[]
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [requestingClass, setRequestingClass] = useState(false)
  const [classRequestStatus, setClassRequestStatus] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("student_token")
    const storedData = localStorage.getItem("student_data")

    if (!token || !storedData) {
      router.push("/student-login")
      return
    }

    fetchStudentProfile(token)
    fetchClasses()
    fetchBooks()
    fetchAnnouncements()
  }, [router])

  const fetchStudentProfile = async (token: string) => {
    try {
      const res = await fetch("/api/student-auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        
        if (!data.profileCompleted) {
          localStorage.setItem("student_data", JSON.stringify(data))
          router.push("/student-dashboard/complete-profile")
          return
        }
        
        setStudent(data)
        localStorage.setItem("student_data", JSON.stringify(data))
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes")
      if (res.ok) {
        const data = await res.json()
        setClasses(data)
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error)
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

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements")
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data.slice(0, 5))
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("student_token")
    localStorage.removeItem("student_data")
    router.push("/student-login")
  }

  const handleClassRequest = async () => {
    if (!selectedClass) return

    const token = localStorage.getItem("student_token")
    setRequestingClass(true)

    try {
      const res = await fetch("/api/student-auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestedClass: selectedClass })
      })

      if (res.ok) {
        setClassRequestStatus("success")
        fetchStudentProfile(token!)
      } else {
        setClassRequestStatus("error")
      }
    } catch (error) {
      setClassRequestStatus("error")
    } finally {
      setRequestingClass(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-amber-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-5 h-5" />
      case "rejected":
        return <XCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  const myClassBooks = student.approvedClass
    ? books.filter((book) => book.classNumbers?.includes(student.approvedClass))
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-800">Bright Future Academy</span>
                <span className="text-xs text-slate-500 block">Student Portal</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
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
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                  {student.fullName}
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {student.fullName.split(" ")[0]}!
          </h1>
          <p className="text-slate-600">Here's your student dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Admission Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl ${getStatusColor(
                    student.admissionStatus
                  )} flex items-center justify-center text-white`}
                >
                  {getStatusIcon(student.admissionStatus)}
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800 capitalize">
                    {student.admissionStatus}
                  </p>
                  <p className="text-sm text-slate-500">
                    {student.admissionStatus === "approved"
                      ? "You're officially enrolled!"
                      : student.admissionStatus === "rejected"
                      ? "Contact school for details"
                      : "Awaiting admin approval"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Your Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  {student.classDetails ? (
                    <>
                      <p className="text-xl font-bold text-slate-800">
                        {student.classDetails.classNumber}
                        {student.classDetails.section && ` - ${student.classDetails.section}`}
                      </p>
                      <p className="text-sm text-slate-500">Enrolled class</p>
                    </>
                  ) : student.approvedClass ? (
                    <>
                      <p className="text-xl font-bold text-slate-800">
                        Assigned
                      </p>
                      <p className="text-sm text-slate-500">Enrolled class</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-slate-800">Not Assigned</p>
                      <p className="text-sm text-slate-500">Pending assignment</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Class Books
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-800">
                    {student.classDetails?.books?.length || 0}
                  </p>
                  <p className="text-sm text-slate-500">
                    {student.classDetails ? "For your class" : "Books available"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {student.admissionStatus === "pending" && (
          <Card className="border-0 shadow-md bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-l-amber-500 mb-8">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Admission Pending</h3>
                  <p className="text-slate-600 text-sm">
                    Your admission is being reviewed by the school administration. You'll receive
                    full access to the dashboard once your admission is approved. Please check
                    back later or contact the school office for updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {student.admissionStatus === "rejected" && (
          <Card className="border-0 shadow-md bg-red-50 border-l-4 border-l-red-500 mb-8">
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">Admission Not Approved</h3>
                  <p className="text-slate-600 text-sm">
                    Unfortunately, your admission was not approved at this time. Please contact
                    the school office for more information about the decision or to discuss
                    alternative options.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {student.admissionStatus === "approved" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {student.classDetails?.books && student.classDetails.books.length > 0 && (
              <Card className="border-0 shadow-md bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookMarked className="w-5 h-5 text-purple-500" />
                    Your Class Books
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {student.classDetails.books.slice(0, 5).map((book: any) => (
                      <div
                        key={book._id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                      >
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 truncate">{book.title}</p>
                          <p className="text-xs text-slate-500">{book.author || "Unknown Author"}</p>
                        </div>
                      </div>
                    ))}
                    {student.classDetails.books.length > 5 && (
                      <p className="text-sm text-slate-500 text-center pt-2">
                        +{student.classDetails.books.length - 5} more books
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5 text-amber-500" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {announcements.length > 0 ? (
                  <div className="space-y-3">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement._id}
                        className="p-3 bg-slate-50 rounded-xl"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded ${
                              announcement.type === "urgent"
                                ? "bg-red-100 text-red-700"
                                : announcement.type === "exam"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {announcement.type}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-medium text-slate-800 text-sm">
                          {announcement.title}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {announcement.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No announcements yet</p>
                )}
              </CardContent>
            </Card>

            {student.classDetails && (
              <Card className="border-0 shadow-md bg-white lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ClipboardList className="w-5 h-5 text-blue-500" />
                    Class Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Class</p>
                      <p className="text-xl font-bold text-slate-800">
                        {student.classDetails.classNumber || student.approvedClass}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Section</p>
                      <p className="text-xl font-bold text-slate-800">
                        {student.classDetails.section || "A"}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Class Teacher</p>
                      <p className="text-xl font-bold text-slate-800">
                        {student.classDetails.teacherName || "Not Assigned"}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-500 mb-1">Students</p>
                      <p className="text-xl font-bold text-slate-800">
                        {student.classDetails.studentCount || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
