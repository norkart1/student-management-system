"use client"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { getAuthToken } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/spinner"
import { 
  GraduationCap, 
  Settings2, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye,
  Trash2,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Save,
  AlertCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdmissionSettings {
  _id?: string
  isOpen: boolean
  academicYear: string
  openClasses: number[]
  description: string
  requirements: string
  startDate: string | null
  endDate: string | null
}

interface Application {
  _id: string
  applicationNumber: string
  studentName: string
  dateOfBirth: string
  gender: string
  applyingForClass: number
  parentName: string
  parentPhone: string
  parentEmail: string
  address: string
  previousSchool: string | null
  academicYear: string
  status: "pending" | "approved" | "rejected"
  notes?: string
  createdAt: string
}

const allClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export default function AdmissionsPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "applications">("applications")
  const [settings, setSettings] = useState<AdmissionSettings>({
    isOpen: false,
    academicYear: new Date().getFullYear().toString(),
    openClasses: [],
    description: "",
    requirements: "",
    startDate: null,
    endDate: null
  })
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [expandedApp, setExpandedApp] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = getAuthToken()
      const [settingsRes, appsRes] = await Promise.all([
        fetch("/api/admission-settings"),
        fetch("/api/admission-applications", {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ])
      
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData)
      }
      
      if (appsRes.ok) {
        const appsData = await appsRes.json()
        setApplications(appsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    const token = getAuthToken()
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/admission-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" })
      } else {
        setMessage({ type: "error", text: "Failed to save settings" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateStatus = async (appId: string, status: string) => {
    const token = getAuthToken()
    try {
      const res = await fetch(`/api/admission-applications/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status, reviewedAt: new Date() })
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleDeleteApplication = async (appId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return
    
    const token = getAuthToken()
    try {
      const res = await fetch(`/api/admission-applications/${appId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting application:", error)
    }
  }

  const toggleClass = (classNum: number) => {
    setSettings(prev => ({
      ...prev,
      openClasses: prev.openClasses.includes(classNum)
        ? prev.openClasses.filter(c => c !== classNum)
        : [...prev.openClasses, classNum]
    }))
  }

  const getClassLabel = (num: number) => {
    const suffix = num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th"
    return `${num}${suffix} Class`
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

  const filteredApplications = statusFilter === "all" 
    ? applications 
    : applications.filter(app => app.status === statusFilter)

  const pendingCount = applications.filter(a => a.status === "pending").length

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner message="Loading admissions..." />
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="p-6 md:p-8 lg:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Admissions</h1>
              <p className="text-slate-500 text-sm md:text-base">Manage admission settings and applications</p>
            </div>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="text-amber-700 font-medium">{pendingCount} pending application{pendingCount > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === "applications" 
                ? "text-emerald-600" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Applications
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-amber-500 text-white rounded-full">{pendingCount}</span>
              )}
            </div>
            {activeTab === "applications" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === "settings" 
                ? "text-emerald-600" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Settings
            </div>
            {activeTab === "settings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success" 
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                <CardTitle className="text-slate-800 text-lg flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-emerald-600" />
                  Admission Settings
                </CardTitle>
                <CardDescription className="text-slate-500">Configure admission open/close status</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-800">Admission Status</p>
                    <p className="text-sm text-slate-500">Enable or disable new admissions</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, isOpen: !settings.isOpen })}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      settings.isOpen ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span 
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        settings.isOpen ? "translate-x-8" : "translate-x-1"
                      }`} 
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Academic Year</Label>
                  <Input
                    value={settings.academicYear}
                    onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                    placeholder="e.g., 2025"
                    className="border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Description</Label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                    placeholder="Enter admission description (shown to applicants)"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Requirements</Label>
                  <textarea
                    value={settings.requirements}
                    onChange={(e) => setSettings({ ...settings, requirements: e.target.value })}
                    placeholder="Enter admission requirements (shown to applicants)"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  {saving ? "Saving..." : "Save Settings"}
                  <Save className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
                <CardTitle className="text-slate-800 text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  Open Classes
                </CardTitle>
                <CardDescription className="text-slate-500">Select which classes are open for admission</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {allClasses.map(num => (
                    <label
                      key={num}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        settings.openClasses.includes(num)
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Checkbox
                        checked={settings.openClasses.includes(num)}
                        onCheckedChange={() => toggleClass(num)}
                        className="sr-only"
                      />
                      <span className="text-2xl font-bold">{num}</span>
                      <span className="text-xs">Class</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-slate-500 mt-4 text-center">
                  {settings.openClasses.length} class{settings.openClasses.length !== 1 ? "es" : ""} selected
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Filter:</span>
              {["all", "pending", "approved", "rejected"].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    statusFilter === status
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {filteredApplications.length === 0 ? (
              <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Applications</h3>
                  <p className="text-slate-500 text-center">
                    {statusFilter === "all" 
                      ? "No admission applications yet." 
                      : `No ${statusFilter} applications.`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map(app => {
                  const statusStyle = getStatusStyle(app.status)
                  const StatusIcon = statusStyle.icon
                  const isExpanded = expandedApp === app._id

                  return (
                    <Card key={app._id} className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
                      <div 
                        className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => setExpandedApp(isExpanded ? null : app._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold">{app.applyingForClass}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-800">{app.studentName}</h3>
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                                  {app.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500">
                                {app.applicationNumber} - {getClassLabel(app.applyingForClass)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 hidden sm:block">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-slate-100 pt-4">
                          <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">DOB: {new Date(app.dateOfBirth).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">Gender: {app.gender}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">Parent: {app.parentName}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">{app.parentPhone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">{app.parentEmail}</span>
                              </div>
                              <div className="flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-600">{app.address}</span>
                              </div>
                            </div>
                          </div>
                          {app.previousSchool && (
                            <p className="text-sm text-slate-500 mb-4">Previous School: {app.previousSchool}</p>
                          )}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <Button
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app._id, "approved"); }}
                              disabled={app.status === "approved"}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app._id, "rejected"); }}
                              disabled={app.status === "rejected"}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => { e.stopPropagation(); handleDeleteApplication(app._id); }}
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
        )}
      </div>
    </ProtectedLayout>
  )
}
