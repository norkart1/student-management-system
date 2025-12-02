"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  GraduationCap, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  School,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from "lucide-react"

interface AdmissionSettings {
  isOpen: boolean
  academicYear: string
  openClasses: number[]
  description?: string
  requirements?: string
  startDate?: string
  endDate?: string
}

interface FormData {
  studentName: string
  dateOfBirth: string
  gender: string
  applyingForClass: number
  parentName: string
  parentPhone: string
  parentEmail: string
  address: string
  previousSchool: string
}

export function AdmissionApplicationForm() {
  const [settings, setSettings] = useState<AdmissionSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    dateOfBirth: "",
    gender: "",
    applyingForClass: 0,
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    previousSchool: ""
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admission-settings")
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (err) {
      console.error("Failed to fetch admission settings:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/admission-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message)
        setFormData({
          studentName: "",
          dateOfBirth: "",
          gender: "",
          applyingForClass: 0,
          parentName: "",
          parentPhone: "",
          parentEmail: "",
          address: "",
          previousSchool: ""
        })
      } else {
        setError(data.error || "Failed to submit application")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const getClassLabel = (num: number) => {
    if (num <= 0) return "Select Class"
    const suffix = num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th"
    return `${num}${suffix} Class`
  }

  if (loading) {
    return null
  }

  if (!settings || !settings.isOpen || settings.openClasses.length === 0) {
    return null
  }

  if (success) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
        <p className="text-emerald-300">{success}</p>
        <Button 
          onClick={() => { setSuccess(null); setShowForm(false); }}
          variant="outline" 
          className="mt-4 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
        >
          Close
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setShowForm(!showForm)}
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">New Admission {settings.academicYear}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded">OPEN</span>
          <span className="text-slate-400 text-sm">{showForm ? "Click to close" : "Click to apply"}</span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {settings.description && (
            <p className="text-sm text-slate-400 bg-slate-800/50 p-3 rounded-lg">{settings.description}</p>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Student Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Enter student name"
                  required
                  className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Date of Birth *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                  className="pl-9 bg-slate-800/50 border-slate-700 text-white focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Gender *</Label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
                className="w-full h-10 px-3 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Applying for Class *</Label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={formData.applyingForClass}
                  onChange={(e) => setFormData({ ...formData, applyingForClass: parseInt(e.target.value) })}
                  required
                  className="w-full h-10 pl-9 pr-3 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value={0}>Select Class</option>
                  {settings.openClasses.sort((a, b) => a - b).map(num => (
                    <option key={num} value={num}>{getClassLabel(num)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Parent/Guardian Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Enter parent name"
                  required
                  className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Parent Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="Enter phone number"
                  required
                  className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Parent Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  placeholder="Enter email address"
                  required
                  className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Previous School</Label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  placeholder="Enter previous school (optional)"
                  className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 text-sm">Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
                required
                rows={2}
                className="w-full pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>

          {settings.requirements && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-300 font-medium mb-1">Requirements:</p>
              <p className="text-xs text-amber-200/80">{settings.requirements}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <GraduationCap className="w-4 h-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
