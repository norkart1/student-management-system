"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FolderOpen, AlignLeft, Image, Loader2 } from "lucide-react"
import { getAuthToken } from "@/lib/auth"

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  initialData?: any
}

export function AddCategoryDialog({ open, onOpenChange, onSubmit, initialData }: AddCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnailUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          description: initialData.description || "",
          thumbnailUrl: initialData.thumbnailUrl || "",
        })
        setImagePreview(initialData.thumbnailUrl || null)
      } else {
        setFormData({
          name: "",
          description: "",
          thumbnailUrl: "",
        })
        setImagePreview(null)
      }
    }
  }, [initialData, open])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const token = getAuthToken()
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, thumbnailUrl: data.url }))
        setImagePreview(data.url)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      setFormData({ name: "", description: "", thumbnailUrl: "" })
      setImagePreview(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-800 text-xl font-bold">
            {initialData ? "Edit Exam Category" : "Create Exam Category"}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Categories like "First Semester", "Second Semester"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              Category Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., First Semester 2025"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-emerald-600" />
              Description
            </Label>
            <Input
              id="description"
              placeholder="Brief description of this exam category"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 flex items-center gap-2">
              <Image className="w-4 h-4 text-emerald-600" />
              Thumbnail Image (1280x720 recommended)
            </Label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
                {uploading && <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || uploading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md"
            >
              {loading ? "Saving..." : (initialData ? "Update Category" : "Create Category")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
