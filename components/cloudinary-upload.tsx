"use client"

import { CldUploadWidget } from "next-cloudinary"
import { Camera, User, BookOpen, X, Loader2 } from "lucide-react"
import { useState, useRef } from "react"

interface CloudinaryUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  type?: "avatar" | "book"
  onRemove?: () => void
  onWidgetOpen?: () => void
  onWidgetClose?: () => void
}

export function CloudinaryUpload({ onUpload, currentImage, type = "avatar", onRemove, onWidgetOpen, onWidgetClose }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const openRef = useRef<(() => void) | null>(null)

  const handleSuccess = (result: any) => {
    setIsUploading(false)
    if (result.info && result.info.secure_url) {
      onUpload(result.info.secure_url)
    }
  }

  const handleUploadStart = () => {
    setIsUploading(true)
  }

  const isAvatar = type === "avatar"
  const Icon = isAvatar ? User : BookOpen

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className={`${isAvatar ? "w-20 h-20 rounded-full" : "w-24 h-32 rounded-lg"} bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg`}>
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : currentImage ? (
            <img 
              src={currentImage} 
              alt="Upload" 
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon className="w-8 h-8 text-white" />
          )}
        </div>
        
        {currentImage && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        
        <CldUploadWidget
          uploadPreset="student_management"
          options={{
            maxFiles: 1,
            resourceType: "image",
            folder: type === "avatar" ? "avatars" : "books",
            cropping: true,
            croppingAspectRatio: isAvatar ? 1 : 0.75,
            croppingShowDimensions: true,
          }}
          onSuccess={handleSuccess}
          onQueuesStart={handleUploadStart}
          onError={() => setIsUploading(false)}
          onOpen={() => onWidgetOpen?.()}
          onClose={() => onWidgetClose?.()}
        >
          {({ open }) => {
            openRef.current = open
            return (
              <button
                type="button"
                onClick={() => {
                  open()
                }}
                className={`absolute ${isAvatar ? "bottom-0 right-0 w-7 h-7" : "bottom-1 right-1 w-8 h-8"} bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-emerald-600 transition-colors`}
              >
                <Camera className={isAvatar ? "w-3.5 h-3.5" : "w-4 h-4"} />
              </button>
            )
          }}
        </CldUploadWidget>
      </div>
      <p className="text-xs text-slate-400">Click to upload photo</p>
    </div>
  )
}
