"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookOpen, Search, Check, Loader2 } from "lucide-react"

interface Book {
  _id: string
  title: string
  author: string
  subject?: string
  imageUrl?: string
}

interface AssignBooksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  selectedBookIds: string[]
  onSubmit: (bookIds: string[]) => Promise<void>
  loading?: boolean
}

export function AssignBooksDialog({ 
  open, 
  onOpenChange, 
  title,
  selectedBookIds,
  onSubmit,
  loading = false
}: AssignBooksDialogProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      fetchBooks()
      setSelectedIds(selectedBookIds)
      setSearch("")
    }
  }, [open, selectedBookIds])

  const fetchBooks = async () => {
    setFetching(true)
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
      setFetching(false)
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
      await onSubmit(selectedIds)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving books:", error)
    } finally {
      setSaving(false)
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    (book.subject && book.subject.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl w-[95vw] max-w-lg max-h-[85vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-slate-800 text-lg sm:text-xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Select books to assign to this class
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-slate-200 focus:border-emerald-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 mt-3">
          {fetching ? (
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
              {filteredBooks.map((book) => {
                const isSelected = selectedIds.includes(book._id)
                
                return (
                  <div
                    key={book._id}
                    onClick={() => toggleBook(book._id)}
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      isSelected
                        ? "bg-purple-500 border-purple-500"
                        : "border-slate-300"
                    }`}>
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    
                    <div className="w-8 h-11 rounded bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center overflow-hidden shrink-0">
                      {book.imageUrl ? (
                        <img src={book.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm truncate">{book.title}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {book.author}
                        {book.subject && <span className="ml-2 text-purple-600">• {book.subject}</span>}
                      </p>
                    </div>
                  </div>
                )
              })}
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
              disabled={saving || loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {saving || loading ? (
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
