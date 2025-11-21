"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CalendarPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      const data = await response.json()
      if (Array.isArray(data)) {
        setStudents(data.slice(0, 3))
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-pink-500",
      "bg-blue-500",
      "bg-purple-500",
    ]
    return colors[index % colors.length]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-emerald-500 p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h1 className="text-xl font-semibold text-gray-800 text-center">
              Attendance Calendar
            </h1>
            <p className="text-sm text-gray-500 text-center mt-1">
              {formatDate(selectedDate)}
            </p>
          </div>

          <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-white font-semibold text-lg">
                Present Today
              </h2>
              <span className="text-white/80 text-sm">
                {students.length} {students.length === 1 ? 'student' : 'students'}
              </span>
            </div>
            
            {loading ? (
              <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
                Loading...
              </div>
            ) : students.length > 0 ? (
              students.map((student, idx) => (
                <div
                  key={student._id || idx}
                  className="bg-white rounded-2xl p-4 shadow-lg flex items-center justify-between hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className={`h-12 w-12 ${getAvatarColor(idx)}`}>
                      <AvatarFallback className="text-white font-semibold">
                        {getInitials(student.firstName, student.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {student.firstName} {student.lastName}
                      </p>
                      {student.className && (
                        <p className="text-sm text-gray-500">
                          Class {student.className} {student.section ? `- ${student.section}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-teal-100 rounded-full p-2">
                    <CheckCircle2 className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
                No attendance records for this date
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
