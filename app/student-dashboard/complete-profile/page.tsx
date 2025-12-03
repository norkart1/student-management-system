"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  GraduationCap,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  School,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogOut
} from "lucide-react"

interface AdmissionSettings {
  isOpen: boolean
  academicYear: string
  openClasses: string[]
  description?: string
  requirements?: string
}

interface ClassData {
  _id: string
  name: string
  section: string | null
  academicYear: string
}

export default function CompleteProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [settings, setSettings] = useState<AdmissionSettings | null>(null)
  const [classes, setClasses] = useState<ClassData[]>([])
  const [studentName, setStudentName] = useState("")
  
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    applyingForClass: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    previousSchool: ""
  })

  useEffect(() => {
    const token = localStorage.getItem("student_token")
    const storedData = localStorage.getItem("student_data")

    if (!token || !storedData) {
      router.push("/student-login")
      return
    }

    const data = JSON.parse(storedData)
    setStudentName(data.fullName || "")
    
    if (data.profileCompleted) {
      router.push("/student-dashboard")
      return
    }

    fetchAdmissionSettings().finally(() => {
      setLoading(false)
    })
  }, [router])

  const fetchAdmissionSettings = async () => {
    try {
      const [settingsRes, classesRes] = await Promise.all([
        fetch("/api/admission-settings"),
        fetch("/api/classes")
      ])
      
      if (settingsRes.ok) {
        const data = await settingsRes.json()
        setSettings(data)
      }
      
      if (classesRes.ok) {
        const classesData = await classesRes.json()
        setClasses(classesData)
      }
    } catch (err) {
      console.error("Failed to fetch admission settings:", err)
    }
  }

  const getOpenClasses = () => {
    if (!settings?.openClasses?.length) return []
    return classes.filter(c => settings.openClasses.includes(c._id))
  }

  const getClassDisplayName = (classData: ClassData) => {
    if (classData.section) {
      return `${classData.name} - ${classData.section}`
    }
    return classData.name
  }

  const handleLogout = () => {
    localStorage.removeItem("student_token")
    localStorage.removeItem("student_data")
    router.push("/student-login")
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const token = localStorage.getItem("student_token")
    if (!token) {
      router.push("/student-login")
      return
    }

    try {
      const res = await fetch("/api/student-auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("student_data", JSON.stringify(data.student))
        setSuccess(true)
        setTimeout(() => {
          router.push("/student-dashboard")
        }, 2000)
      } else {
        setError(data.error || "Failed to complete profile")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-emerald-500/30 bg-slate-800/50 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Application Submitted!</h2>
            <p className="text-slate-400 mb-4">
              Your admission application has been submitted. Please wait for approval from the school administration.
            </p>
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Redirecting to dashboard...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Complete Your Profile</h1>
              <p className="text-xs text-slate-400">Step 2: Admission Application</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              Complete Admission Application
            </CardTitle>
            <p className="text-sm text-slate-400">
              Welcome, <span className="text-amber-400 font-medium">{studentName}</span>! Please complete your admission application below.
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm mb-6">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {settings?.description && (
              <div className="p-4 bg-slate-700/30 rounded-lg mb-6">
                <p className="text-sm text-slate-300">{settings.description}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Date of Birth *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      required
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Gender *</Label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                    className="w-full h-10 px-3 bg-slate-900/50 border border-slate-700 rounded-md text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Applying for Class *</Label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                    <select
                      value={formData.applyingForClass}
                      onChange={(e) => setFormData({ ...formData, applyingForClass: e.target.value })}
                      required
                      className="w-full h-10 pl-10 pr-3 bg-slate-900/50 border border-slate-700 rounded-md text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="">Select Class</option>
                      {getOpenClasses().map(classData => (
                        <option key={classData._id} value={classData._id}>
                          {getClassDisplayName(classData)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Previous School</Label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      placeholder="Enter previous school (optional)"
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Parent/Guardian Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="Enter parent name"
                      required
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Parent Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="Enter phone number"
                      required
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Parent Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      placeholder="Enter email address"
                      required
                      className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                    required
                    rows={2}
                    className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-slate-700 rounded-md text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>
              </div>

              {settings?.requirements && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-300 font-medium mb-1">Requirements:</p>
                  <p className="text-xs text-amber-200/80">{settings.requirements}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting || !formData.applyingForClass}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
