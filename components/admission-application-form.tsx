"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  GraduationCap, 
  ArrowRight
} from "lucide-react"

interface AdmissionSettings {
  isOpen: boolean
  academicYear: string
  openClasses: number[]
  description?: string
}

export function AdmissionApplicationForm() {
  const [settings, setSettings] = useState<AdmissionSettings | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return null
  }

  if (!settings || !settings.isOpen || settings.openClasses.length === 0) {
    return null
  }

  return (
    <Link 
      href="/student-register"
      className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group"
    >
      <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">New Admission {settings.academicYear}</h3>
            <p className="text-sm text-slate-400">Create account and apply for admission</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded">OPEN</span>
          <span className="inline-flex items-center gap-1 text-amber-400 text-sm font-medium group-hover:gap-2 transition-all">
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
