"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, BookOpen, User, Download, Share2 } from "lucide-react"
import { generateQRCode, getProfileUrl } from "@/lib/qr-utils"

interface Book {
  _id: string
  title: string
  author: string
  imageUrl?: string
}

export default function BookProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState<string>("")

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setBook(data)
          const profileUrl = getProfileUrl('books', params.id as string)
          const qr = await generateQRCode(profileUrl)
          setQrCode(qr)
        }
      } catch (error) {
        console.error("Error fetching book:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [params.id])

  const handleShare = async () => {
    const profileUrl = getProfileUrl('books', params.id as string)
    if (navigator.share) {
      await navigator.share({
        title: book?.title,
        text: `Check out "${book?.title}" by ${book?.author}`,
        url: profileUrl
      })
    } else {
      await navigator.clipboard.writeText(profileUrl)
      alert('Profile link copied to clipboard!')
    }
  }

  const handleDownloadQR = () => {
    if (!qrCode || !book) return
    const link = document.createElement('a')
    link.download = `${book.title.replace(/\s+/g, '-')}-qr.png`
    link.href = qrCode
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Book not found</p>
          <Button onClick={() => router.back()} variant="outline" className="text-white border-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <Button 
          onClick={() => router.back()} 
          variant="ghost" 
          size="icon"
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>

        <Card className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-5">
              {book.imageUrl ? (
                <div className="w-28 h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border-2 border-slate-100">
                  <img 
                    src={book.imageUrl} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-28 h-40 flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
              )}

              <div className="flex-1 min-w-0 pt-2">
                <h1 className="text-xl font-bold text-slate-800 leading-tight mb-1 line-clamp-2">{book.title}</h1>
                <p className="text-slate-500 text-sm mb-3">@{book.author.toLowerCase().replace(/\s+/g, '_')}</p>
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">By {book.author}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Type</p>
                  <p className="text-lg font-bold text-slate-800">Book</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Status</p>
                  <p className="text-lg font-bold text-emerald-600">Active</p>
                </div>
                <Button 
                  onClick={handleShare}
                  className="bg-teal-800 hover:bg-teal-900 text-white rounded-xl px-6 h-10"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>

          {qrCode && (
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 p-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">QR Code</p>
                  <p className="text-xs text-slate-500">Scan to view profile</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="w-20 h-20"
                    />
                  </div>
                  <Button 
                    onClick={handleDownloadQR}
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
