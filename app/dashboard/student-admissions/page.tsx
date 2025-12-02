"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { getAuthToken } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/spinner"
import Image from "next/image"
import {
  GraduationCap,
  Users,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  UserCheck,
  School,
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface StudentUser {
  _id: string
  fullName: string
  email: string
  phone: string
  imageUrl: string | null
  admissionStatus: "pending" | "approved" | "rejected"
  approvedClass: number | null
  approvedAt: string | null
  createdAt: string
}

const allClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export default function StudentAdmissionsPage() {
  const [students, setStudents] = useState<StudentUser[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState<{ [key: string]: number }>({})
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const token = getAuthToken()
      const res = await fetch("/api/student-users", {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      }
    } catch (error) {
      console.error("Failed to fetch students:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (studentId: string, status: string) => {
    const token = getAuthToken()
    setUpdating(studentId)

    try {
      const body: any = { admissionStatus: status }
      
      if (status === "approved" && selectedClass[studentId]) {
        body.approvedClass = selectedClass[studentId]
      }

      const res = await fetch(`/api/student-users/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        fetchStudents()
      }
    } catch (error) {
      console.error("Failed to update student:", error)
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student account?")) return

    const token = getAuthToken()
    try {
      const res = await fetch(`/api/student-users/${studentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        fetchStudents()
      }
    } catch (error) {
      console.error("Failed to delete student:", error)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle2 }
      case "rejected":
        return { bg: "bg-red-100", text: "text-red-700", icon: XCircle }
      default:
        return { bg: "bg-amber-100", text: "text-amber-700", icon: Clock }
    }
  }

  const filteredStudents = students
    .filter((s) => statusFilter === "all" || s.admissionStatus === statusFilter)
    .filter(
      (s) =>
        searchQuery === "" ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const pendingCount = students.filter((s) => s.admissionStatus === "pending").length
  const approvedCount = students.filter((s) => s.admissionStatus === "approved").length

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner message="Loading student accounts..." />
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
              <UserCheck className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Student Admissions
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                Review and approve student account registrations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="text-amber-700 font-medium">
                  {pendingCount} pending
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-700 font-medium">
                {approvedCount} approved
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Filter:</span>
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  statusFilter === status
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No Student Accounts
              </h3>
              <p className="text-slate-500 text-center">
                {statusFilter === "all"
                  ? "No student registrations yet."
                  : `No ${statusFilter} students.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredStudents.map((student) => {
              const statusStyle = getStatusStyle(student.admissionStatus)
              const StatusIcon = statusStyle.icon
              const isExpanded = expandedStudent === student._id

              return (
                <Card
                  key={student._id}
                  className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() =>
                      setExpandedStudent(isExpanded ? null : student._id)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                          {student.imageUrl ? (
                            <Image
                              src={student.imageUrl}
                              alt={student.fullName}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-800">
                              {student.fullName}
                            </h3>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                            >
                              {student.admissionStatus}
                            </span>
                            {student.approvedClass && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                Class {student.approvedClass}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 hidden sm:block">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 pt-4">
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">{student.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">
                              Registered: {new Date(student.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {student.approvedAt && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-slate-600">
                                Approved: {new Date(student.approvedAt).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {student.admissionStatus === "pending" && (
                        <div className="p-4 bg-slate-50 rounded-xl mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <School className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">
                              Assign Class for Approval
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {allClasses.map((num) => (
                              <button
                                key={num}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedClass((prev) => ({
                                    ...prev,
                                    [student._id]: num
                                  }))
                                }}
                                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                  selectedClass[student._id] === num
                                    ? "bg-emerald-500 text-white"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300"
                                }`}
                              >
                                Class {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUpdateStatus(student._id, "approved")
                          }}
                          disabled={
                            student.admissionStatus === "approved" ||
                            updating === student._id ||
                            (student.admissionStatus === "pending" &&
                              !selectedClass[student._id])
                          }
                          className="bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          {updating === student._id ? (
                            "Updating..."
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUpdateStatus(student._id, "rejected")
                          }}
                          disabled={
                            student.admissionStatus === "rejected" ||
                            updating === student._id
                          }
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteStudent(student._id)
                          }}
                          className="text-slate-500 hover:text-red-600 hover:bg-red-50 ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
