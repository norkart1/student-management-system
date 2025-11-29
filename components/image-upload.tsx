"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { getAuthToken } from "@/lib/auth"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  type?: "profile" | "book"
}

export function ImageUpload({ value, onChange, type = "profile" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const token = getAuthToken()
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isProfile = type === "profile"
  const containerClass = isProfile
    ? "w-20 h-20 rounded-full"
    : "w-16 h-24 rounded-lg"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div
          className={`${containerClass} bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden`}
        >
          {value ? (
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          ) : (
            <Camera className="w-8 h-8 text-white" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
        {value && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="text-xs border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        {uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
