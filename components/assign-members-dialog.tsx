"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Users, GraduationCap, User } from "lucide-react"

interface Member {
  _id: string
  fullName: string
  email: string
  registrationNumber?: string
  imageUrl?: string
}

interface AssignMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  type: "students" | "teachers"
  members: Member[]
  selectedIds: string[]
  onSubmit: (selectedIds: string[]) => void
  loading?: boolean
}

export function AssignMembersDialog({
  open,
  onOpenChange,
  title,
  type,
  members,
  selectedIds,
  onSubmit,
  loading = false
}: AssignMembersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setSelected([...selectedIds])
      setSearchQuery("")
    }
    wasOpenRef.current = open
  }, [open, selectedIds])

  const filteredMembers = members.filter(member => 
    member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.registrationNumber && member.registrationNumber.includes(searchQuery))
  )

  const toggleMember = (memberId: string) => {
    setSelected(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const toggleAll = () => {
    if (selected.length === filteredMembers.length) {
      setSelected([])
    } else {
      setSelected(filteredMembers.map(m => m._id))
    }
  }

  const handleSubmit = () => {
    onSubmit(selected)
    onOpenChange(false)
  }

  const Icon = type === "students" ? GraduationCap : Users

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-slate-200 bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${type}...`}
              className="pl-9 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-slate-500">
              {selected.length} of {members.length} selected
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleAll}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              {selected.length === filteredMembers.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <ScrollArea className="h-[300px] rounded-lg border border-slate-200">
            <div className="p-2 space-y-1">
              {filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Icon className="w-10 h-10 mb-2" />
                  <p className="text-sm">No {type} found</p>
                </div>
              ) : (
                filteredMembers.map(member => (
                  <label
                    key={member._id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      selected.includes(member._id) 
                        ? "bg-emerald-50 border border-emerald-200" 
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <Checkbox
                      checked={selected.includes(member._id)}
                      onCheckedChange={() => toggleMember(member._id)}
                      className="border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-700 truncate">{member.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {member.registrationNumber ? `#${member.registrationNumber} - ` : ""}{member.email}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
