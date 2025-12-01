"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Clock, User, Hash, Loader2 } from "lucide-react"

interface Application {
  _id: string
  studentId: string
  studentName: string
  studentEmail: string
  registrationNumber: string
  studentImage?: string
  status: "pending" | "approved" | "rejected"
  appliedAt: string
}

interface ApplicationApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applications: Application[]
  categoryName: string
  onApprove: (applicationId: string) => Promise<void>
  onReject: (applicationId: string) => Promise<void>
}

export function ApplicationApprovalDialog({ 
  open, 
  onOpenChange, 
  applications,
  categoryName,
  onApprove,
  onReject,
}: ApplicationApprovalDialogProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const handleApprove = async (id: string) => {
    setLoadingId(id)
    try {
      await onApprove(id)
    } finally {
      setLoadingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setLoadingId(id)
    try {
      await onReject(id)
    } finally {
      setLoadingId(null)
    }
  }

  const filteredApplications = applications.filter(app => 
    filter === "all" || app.status === filter
  )

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl font-bold">
            Exam Applications
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Manage applications for "{categoryName}"
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status 
                ? "bg-emerald-600 text-white" 
                : "border-slate-200 text-slate-600"
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status]})
            </Button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div 
                key={app._id} 
                className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    {app.studentImage ? (
                      <img src={app.studentImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{app.studentName}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Hash className="w-3 h-3" />
                      <span>{app.registrationNumber}</span>
                    </div>
                    <p className="text-xs text-slate-400">{formatDate(app.appliedAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {app.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(app._id)}
                        disabled={loadingId === app._id}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        {loadingId === app._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(app._id)}
                        disabled={loadingId === app._id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {loadingId === app._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </Button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === "approved" 
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {app.status === "approved" ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p>No applications found</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
