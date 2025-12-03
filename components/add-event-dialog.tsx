"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, X } from "lucide-react"

interface AddEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
  onEventAdded: () => void
}

export function AddEventDialog({ open, onOpenChange, selectedDate, onEventAdded }: AddEventDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("general")
  const [loading, setLoading] = useState(false)

  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          date: formatDateForAPI(selectedDate),
          type
        })
      })

      if (response.ok) {
        setTitle("")
        setDescription("")
        setType("general")
        onOpenChange(false)
        onEventAdded()
      }
    } catch (error) {
      console.error("Error adding event:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-md border-[#CFF4D2]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-[#205072]">
              Add Event
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1 hover:bg-[#CFF4D2]/30"
            >
              <X className="h-5 w-5 text-[#329D9C]" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="bg-[#CFF4D2]/30 rounded-lg p-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#329D9C]" />
            <span className="text-sm font-medium text-[#205072]">
              {formatDate(selectedDate)}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#205072]">
              Event Title
            </Label>
            <Input
              id="title"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#205072]">
              Description (Optional)
            </Label>
            <Input
              id="description"
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-[#205072]">
              Event Type
            </Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-md border border-[#CFF4D2] p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#329D9C] text-[#205072]"
            >
              <option value="general">General</option>
              <option value="holiday">Holiday</option>
              <option value="exam">Exam</option>
              <option value="meeting">Meeting</option>
              <option value="sports">Sports Event</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[#CFF4D2] text-[#205072] hover:bg-[#CFF4D2]/30"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#329D9C] to-[#56C596] hover:from-[#205072] hover:to-[#329D9C] text-white"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
