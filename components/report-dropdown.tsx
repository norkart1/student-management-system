"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileDown, Printer, FileText, Users } from "lucide-react"
import { downloadPDF, printReport, type ReportData } from "@/lib/report-utils"

interface ReportDropdownProps {
  data: any[]
  columns: { key: string; label: string }[]
  type: "students" | "teachers" | "books"
  title: string
  selectedItem?: any
}

export function ReportDropdown({ data, columns, type, title, selectedItem }: ReportDropdownProps) {
  const [loading, setLoading] = useState(false)

  const getDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handlePrintAll = () => {
    const report: ReportData = {
      title: `All ${title}`,
      subtitle: `Complete list of all ${type} records`,
      date: getDate(),
      columns,
      data,
      type
    }
    printReport(report, false)
  }

  const handleDownloadAll = async () => {
    setLoading(true)
    try {
      const report: ReportData = {
        title: `All ${title}`,
        subtitle: `Complete list of all ${type} records`,
        date: getDate(),
        columns,
        data,
        type
      }
      await downloadPDF(report, `all-${type}-report`, false)
    } finally {
      setLoading(false)
    }
  }

  const handlePrintSingle = (item: any) => {
    const report: ReportData = {
      title: `${type === 'books' ? 'Book' : type === 'teachers' ? 'Teacher' : 'Student'} Profile`,
      subtitle: item.fullName || item.title,
      date: getDate(),
      columns,
      data: [item],
      type
    }
    printReport(report, true)
  }

  const handleDownloadSingle = async (item: any) => {
    setLoading(true)
    try {
      const report: ReportData = {
        title: `${type === 'books' ? 'Book' : type === 'teachers' ? 'Teacher' : 'Student'} Profile`,
        subtitle: item.fullName || item.title,
        date: getDate(),
        columns,
        data: [item],
        type
      }
      const name = (item.fullName || item.title || 'record').toLowerCase().replace(/\s+/g, '-')
      await downloadPDF(report, `${type}-${name}`, true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
          disabled={loading}
        >
          <FileDown className="w-4 h-4" />
          {loading ? "Generating..." : "Reports"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          All Records ({data.length})
        </div>
        <DropdownMenuItem onClick={handlePrintAll} className="gap-2 cursor-pointer">
          <Printer className="w-4 h-4 text-slate-500" />
          Print All {title}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadAll} className="gap-2 cursor-pointer">
          <FileDown className="w-4 h-4 text-slate-500" />
          Download All as PDF
        </DropdownMenuItem>
        
        {selectedItem && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Selected: {selectedItem.fullName || selectedItem.title}
            </div>
            <DropdownMenuItem onClick={() => handlePrintSingle(selectedItem)} className="gap-2 cursor-pointer">
              <FileText className="w-4 h-4 text-slate-500" />
              Print Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownloadSingle(selectedItem)} className="gap-2 cursor-pointer">
              <FileDown className="w-4 h-4 text-slate-500" />
              Download Profile PDF
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
