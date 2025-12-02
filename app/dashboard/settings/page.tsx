"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/spinner"
import { getAuthToken } from "@/lib/auth"
import { 
  Settings, 
  User, 
  Mail, 
  Lock, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Database, 
  Activity,
  Shield,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  Trash2,
  Palette,
  LayoutDashboard,
  BarChart3,
  Users,
  GraduationCap,
  BookOpen,
  Save
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface AdminProfile {
  id: string
  username: string
  email: string
  profileImage: string
}

interface SystemStatus {
  mainSite: { status: string; latency: number }
  api: { status: string; latency: number }
  database: { status: string; latency: number; storage: string }
  health: { status: string; uptime: string }
}

interface Device {
  _id: string
  deviceName: string
  deviceType: string
  browser: string
  lastActive: string
  firstLogin: string
  loginCount: number
}

interface DashboardSettings {
  showStudentStats: boolean
  showTeacherStats: boolean
  showBookStats: boolean
  showWeeklyChart: boolean
  showActivityChart: boolean
  primaryColor: string
  accentColor: string
  schoolName: string
  schoolTagline: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [devices, setDevices] = useState<Device[]>([])
  const [devicesLoading, setDevicesLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profileImage: ""
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>({
    showStudentStats: true,
    showTeacherStats: true,
    showBookStats: true,
    showWeeklyChart: true,
    showActivityChart: true,
    primaryColor: "emerald",
    accentColor: "amber",
    schoolName: "Bright Future Academy",
    schoolTagline: "Private School"
  })
  const [savingDashboard, setSavingDashboard] = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchStatus()
    fetchDevices()
    fetchDashboardSettings()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch("/api/admin/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setFormData({
          username: data.username,
          email: data.email,
          profileImage: data.profileImage || ""
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/status")
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error("Error fetching status:", error)
    } finally {
      setStatusLoading(false)
    }
  }

  const fetchDevices = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch("/api/admin/devices", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setDevices(data)
      }
    } catch (error) {
      console.error("Error fetching devices:", error)
    } finally {
      setDevicesLoading(false)
    }
  }

  const fetchDashboardSettings = async () => {
    try {
      const response = await fetch("/api/dashboard-settings")
      if (response.ok) {
        const data = await response.json()
        setDashboardSettings({
          showStudentStats: data.showStudentStats ?? true,
          showTeacherStats: data.showTeacherStats ?? true,
          showBookStats: data.showBookStats ?? true,
          showWeeklyChart: data.showWeeklyChart ?? true,
          showActivityChart: data.showActivityChart ?? true,
          primaryColor: data.primaryColor || "emerald",
          accentColor: data.accentColor || "amber",
          schoolName: data.schoolName || "Bright Future Academy",
          schoolTagline: data.schoolTagline || "Private School"
        })
      }
    } catch (error) {
      console.error("Error fetching dashboard settings:", error)
    }
  }

  const handleDashboardSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingDashboard(true)
    setMessage(null)
    
    try {
      const token = getAuthToken()
      const response = await fetch("/api/dashboard-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dashboardSettings)
      })
      
      if (response.ok) {
        setMessage({ type: "success", text: "Dashboard settings saved successfully!" })
      } else {
        setMessage({ type: "error", text: "Failed to save dashboard settings" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving settings" })
    } finally {
      setSavingDashboard(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    
    try {
      const token = getAuthToken()
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" })
        fetchProfile()
      } else {
        const data = await response.json()
        setMessage({ type: "error", text: data.error || "Failed to update profile" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while updating profile" })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }
    
    setSavingPassword(true)
    setMessage(null)
    
    try {
      const token = getAuthToken()
      const response = await fetch("/api/admin/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })
      
      if (response.ok) {
        setMessage({ type: "success", text: "Password updated successfully!" })
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        const data = await response.json()
        setMessage({ type: "error", text: data.error || "Failed to update password" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while updating password" })
    } finally {
      setSavingPassword(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "mobile":
        return Smartphone
      case "tablet":
        return Tablet
      default:
        return Monitor
    }
  }

  const StatusIndicator = ({ status: statusVal, label, latency, extra }: { status: string; label: string; latency?: number; extra?: string }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
      <div className="flex items-center gap-3">
        {statusVal === "online" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
        <div>
          <p className="font-medium text-slate-800">{label}</p>
          {extra && <p className="text-xs text-slate-500">{extra}</p>}
        </div>
      </div>
      <div className="text-right">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusVal === "online" 
            ? "bg-emerald-100 text-emerald-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {statusVal === "online" ? "Online" : "Offline"}
        </span>
        {latency !== undefined && latency > 0 && (
          <p className="text-xs text-slate-400 mt-1">{latency}ms</p>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner message="Loading settings..." />
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="p-6 md:p-8 lg:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Settings className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Settings</h1>
              <p className="text-slate-500 text-sm md:text-base">Manage your account and system settings</p>
            </div>
          </div>
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

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-emerald-600" />
                <div>
                  <CardTitle className="text-slate-800 text-lg">Profile Settings</CardTitle>
                  <CardDescription className="text-slate-500">Update your account information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                      {formData.profileImage ? (
                        <img 
                          src={formData.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-emerald-600 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-slate-400">Click camera icon to change photo</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Enter username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-600" />
                <div>
                  <CardTitle className="text-slate-800 text-lg">Change Password</CardTitle>
                  <CardDescription className="text-slate-500">Update your account password</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-slate-700">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-700">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={savingPassword}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white mt-2"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <div>
                  <CardTitle className="text-slate-800 text-lg">Logged In Devices</CardTitle>
                  <CardDescription className="text-slate-500">Devices that have accessed your account</CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setDevicesLoading(true)
                  fetchDevices()
                }}
                disabled={devicesLoading}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {devicesLoading ? (
              <div className="flex justify-center py-8">
                <Spinner message="Loading devices..." />
              </div>
            ) : devices.length > 0 ? (
              <div className="space-y-4">
                {devices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.deviceType)
                  return (
                    <div key={device._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                          <DeviceIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{device.deviceName}</p>
                          <p className="text-sm text-slate-500">{device.browser}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>Last active: {formatDate(device.lastActive)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          {device.loginCount} login{device.loginCount > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No devices found</p>
                <p className="text-sm text-slate-400 mt-1">Devices will appear here after you log in</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-600" />
                <div>
                  <CardTitle className="text-slate-800 text-lg">System Status</CardTitle>
                  <CardDescription className="text-slate-500">Monitor system health and services</CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setStatusLoading(true)
                  fetchStatus()
                }}
                disabled={statusLoading}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {statusLoading ? (
              <div className="flex justify-center py-8">
                <Spinner message="Checking status..." />
              </div>
            ) : status ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusIndicator 
                  status={status.mainSite.status}
                  label="Main Site"
                  latency={status.mainSite.latency}
                />
                <StatusIndicator 
                  status={status.api.status}
                  label="API Server"
                  latency={status.api.latency}
                />
                <StatusIndicator 
                  status={status.database.status}
                  label="Database"
                  latency={status.database.latency}
                  extra={status.database.storage}
                />
                <StatusIndicator 
                  status={status.health.status}
                  label="System Health"
                  extra={`Uptime: ${status.health.uptime}`}
                />
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Unable to fetch system status</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <div>
                <CardTitle className="text-slate-800 text-lg">Security Information</CardTitle>
                <CardDescription className="text-slate-500">Account security details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Authentication</span>
                </div>
                <p className="text-slate-800">Token-based auth</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Database className="w-4 h-4" />
                  <span className="text-sm font-medium">Data Storage</span>
                </div>
                <p className="text-slate-800">MongoDB Atlas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5 text-emerald-600" />
              <div>
                <CardTitle className="text-slate-800 text-lg">Dashboard Customization</CardTitle>
                <CardDescription className="text-slate-500">Customize your dashboard appearance and widgets</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleDashboardSettingsSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName" className="text-slate-700 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      School Name
                    </Label>
                    <Input
                      id="schoolName"
                      value={dashboardSettings.schoolName}
                      onChange={(e) => setDashboardSettings({ ...dashboardSettings, schoolName: e.target.value })}
                      placeholder="Enter school name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolTagline" className="text-slate-700 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-emerald-600" />
                      School Tagline
                    </Label>
                    <Input
                      id="schoolTagline"
                      value={dashboardSettings.schoolTagline}
                      onChange={(e) => setDashboardSettings({ ...dashboardSettings, schoolTagline: e.target.value })}
                      placeholder="Enter tagline"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-700 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    Dashboard Widgets
                  </Label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <Checkbox
                        checked={dashboardSettings.showStudentStats}
                        onCheckedChange={(checked) => setDashboardSettings({ ...dashboardSettings, showStudentStats: !!checked })}
                      />
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Show Student Statistics</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <Checkbox
                        checked={dashboardSettings.showTeacherStats}
                        onCheckedChange={(checked) => setDashboardSettings({ ...dashboardSettings, showTeacherStats: !!checked })}
                      />
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Show Teacher Statistics</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <Checkbox
                        checked={dashboardSettings.showBookStats}
                        onCheckedChange={(checked) => setDashboardSettings({ ...dashboardSettings, showBookStats: !!checked })}
                      />
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Show Book Statistics</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <Checkbox
                        checked={dashboardSettings.showWeeklyChart}
                        onCheckedChange={(checked) => setDashboardSettings({ ...dashboardSettings, showWeeklyChart: !!checked })}
                      />
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Show Weekly Chart</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <Checkbox
                        checked={dashboardSettings.showActivityChart}
                        onCheckedChange={(checked) => setDashboardSettings({ ...dashboardSettings, showActivityChart: !!checked })}
                      />
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">Show Activity Chart</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={savingDashboard}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                {savingDashboard ? "Saving..." : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Dashboard Settings
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
