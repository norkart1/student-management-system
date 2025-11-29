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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 flex items-center justify-center">
        <div className="animate-pulse text-emerald-600">Loading...</div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Book not found</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            size="icon"
            className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Button>
        </div>

        <div className="h-[45vh] relative overflow-hidden">
          {book.imageUrl ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <img 
                src={book.imageUrl} 
                alt={book.title}
                className="h-full max-w-full object-contain shadow-2xl"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <BookOpen className="w-32 h-32 text-white/80" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="relative -mt-24 px-4 pb-8">
          <Card className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-visible">
            <div className="p-6 pt-20 text-center">
              <div className="absolute left-1/2 -translate-x-1/2 -top-14">
                {book.imageUrl ? (
                  <div className="w-20 h-28 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-white">
                    <img 
                      src={book.imageUrl} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-white shadow-lg flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>

              <h1 className="text-2xl font-bold text-slate-800 mb-1">{book.title}</h1>
              <p className="text-emerald-600 font-medium mb-6">Book</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm">By {book.author}</span>
                </div>
              </div>

              {qrCode && (
                <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl p-5 mb-6 border border-slate-100">
                  <p className="text-sm font-medium text-slate-600 mb-3">Scan QR Code</p>
                  <div className="bg-white p-3 rounded-xl inline-block shadow-sm">
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="w-36 h-36"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={handleShare}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl h-11"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button 
                  onClick={handleDownloadQR}
                  variant="outline"
                  className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl h-11"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save QR
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
