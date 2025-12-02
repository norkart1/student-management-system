"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Search, Check, Loader2 } from "lucide-react"

interface Book {
  _id: string
  title: string
  author: string
  imageUrl?: string
}

interface SelectBooksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string
  categoryName: string
  selectedBookIds: string[]
  maxScore: number
  onSave: (bookIds: string[], maxScore: number) => Promise<void>
}

export function SelectBooksDialog({ 
  open, 
  onOpenChange, 
  categoryId,
  categoryName,
  selectedBookIds,
  maxScore: initialMaxScore,
  onSave 
}: SelectBooksDialogProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [maxScore, setMaxScore] = useState("100")

  useEffect(() => {
    if (open) {
      fetchBooks()
      setSelectedIds(selectedBookIds)
      setMaxScore(String(initialMaxScore || 100))
    }
  }, [open, selectedBookIds, initialMaxScore])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/books")
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setBooks(data)
        }
      }
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBook = (bookId: string) => {
    setSelectedIds(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(selectedIds, Number(maxScore) || 100)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving books:", error)
    } finally {
      setSaving(false)
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl w-[95vw] max-w-lg max-h-[85vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-slate-800 text-lg sm:text-xl font-bold">
            Select Books as Subjects
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Choose books for "{categoryName}" exam
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">Max Score per Book:</span>
            <Input
              type="number"
              min="1"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              className="w-24 text-center border-slate-200 focus:border-emerald-500"
            />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-slate-200 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 mt-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">{books.length === 0 ? "No books available. Add books first." : "No books found"}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  onClick={() => toggleBook(book._id)}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                    selectedIds.includes(book._id)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedIds.includes(book._id)
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-300"
                  }`}>
                    {selectedIds.includes(book._id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  
                  <div className="w-8 h-11 rounded bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden shrink-0">
                    {book.imageUrl ? (
                      <img src={book.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{book.title}</p>
                    <p className="text-xs text-slate-500 truncate">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3 shrink-0">
          <span className="text-sm text-slate-500">
            {selectedIds.length} book{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-slate-200 text-slate-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving || selectedIds.length === 0}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                "Save Selection"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
