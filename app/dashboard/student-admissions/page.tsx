"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { getAuthToken } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/spinner"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import Image from "next/image"
import {
  Users,
  User,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Search,
  MapPin,
  KeyRound,
  AtSign,
  Trash2,
  Clock
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface StudentUser {
  _id: string
  fullName: string
  email: string
  phone: string
  address?: string
  username?: string
  imageUrl: string | null
  createdAt: string
}

export default function StudentAccountsPage() {
  const [students, setStudents] = useState<StudentUser[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<StudentUser | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  const openDeleteDialog = (student: StudentUser) => {
    setStudentToDelete(student)
    setDeleteDialogOpen(true)
  }

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return

    setDeleting(true)
    const token = getAuthToken()
    try {
      const res = await fetch(`/api/student-users/${studentToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        fetchStudents()
        setDeleteDialogOpen(false)
        setStudentToDelete(null)
      }
    } catch (error) {
      console.error("Failed to delete student:", error)
    } finally {
      setDeleting(false)
    }
  }

  const filteredStudents = students.filter(
    (s) =>
      searchQuery === "" ||
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                Student Accounts
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                View student account details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
            <Users className="w-5 h-5 text-emerald-500" />
            <span className="text-emerald-700 font-medium">
              {students.length} students
            </span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-10"
          />
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
                No student accounts found.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredStudents.map((student) => {
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
                          <h3 className="font-semibold text-slate-800">
                            {student.fullName}
                          </h3>
                          <p className="text-sm text-slate-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">Name:</span>
                          <span className="text-slate-700 font-medium">{student.fullName}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">Email:</span>
                          <span className="text-slate-700 font-medium">{student.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <AtSign className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">Username:</span>
                          <span className="text-slate-700 font-medium">{student.username || student.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">Phone:</span>
                          <span className="text-slate-700 font-medium">{student.phone || "Not provided"}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">Address:</span>
                          <span className="text-slate-700 font-medium">{student.address || "Not provided"}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <KeyRound className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">Password:</span>
                          <span className="text-slate-700 font-medium">********</span>
                          <span className="text-xs text-slate-400">(encrypted)</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-500">Registered:</span>
                          <span className="text-slate-700 font-medium">
                            {new Date(student.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            openDeleteDialog(student)
                          }}
                          className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete Account
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

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteStudent}
        title="Delete Student Account"
        itemName={studentToDelete?.fullName}
        loading={deleting}
      />
    </ProtectedLayout>
  )
}
