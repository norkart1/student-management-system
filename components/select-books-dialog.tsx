"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookOpen, Search, Check, Loader2, ChevronDown, ChevronUp } from "lucide-react"

interface Book {
  _id: string
  title: string
  author: string
  imageUrl?: string
}

interface BookSettings {
  maxScore: number
  passMarks: number
}

interface SelectBooksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string
  categoryName: string
  selectedBookIds: string[]
  maxScore: number
  existingSubjects?: Array<{ bookId?: string, maxScore: number, passMarks?: number }>
  onSave: (bookIds: string[], maxScore: number, bookSettings?: { [bookId: string]: BookSettings }) => Promise<void>
}

export function SelectBooksDialog({ 
  open, 
  onOpenChange, 
  categoryId,
  categoryName,
  selectedBookIds,
  maxScore: initialMaxScore,
  existingSubjects,
  onSave 
}: SelectBooksDialogProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [defaultMaxScore, setDefaultMaxScore] = useState("100")
  const [defaultPassMarks, setDefaultPassMarks] = useState("25")
  const [bookSettings, setBookSettings] = useState<{ [bookId: string]: BookSettings }>({})
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set())
  const [manuallyOverridden, setManuallyOverridden] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (open) {
      fetchBooks()
      setSelectedIds(selectedBookIds)
      const defaultMax = initialMaxScore || 100
      const defaultPass = Math.round(defaultMax * 0.25)
      setDefaultMaxScore(String(defaultMax))
      setDefaultPassMarks(String(defaultPass))
      
      const initialSettings: { [bookId: string]: BookSettings } = {}
      const overridden = new Set<string>()
      
      if (existingSubjects) {
        existingSubjects.forEach(subject => {
          if (subject.bookId) {
            const maxScore = subject.maxScore || defaultMax
            const passMarks = subject.passMarks ?? Math.round(maxScore * 0.25)
            initialSettings[subject.bookId] = { maxScore, passMarks }
            
            if (maxScore !== defaultMax || passMarks !== defaultPass) {
              overridden.add(subject.bookId)
            }
          }
        })
      }
      
      selectedBookIds.forEach(bookId => {
        if (!initialSettings[bookId]) {
          initialSettings[bookId] = { maxScore: defaultMax, passMarks: defaultPass }
        }
      })
      
      setBookSettings(initialSettings)
      setExpandedBooks(new Set())
      setManuallyOverridden(overridden)
    }
  }, [open, selectedBookIds, initialMaxScore, existingSubjects])

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
    setSelectedIds(prev => {
      const isSelected = prev.includes(bookId)
      if (isSelected) {
        const newSettings = { ...bookSettings }
        delete newSettings[bookId]
        setBookSettings(newSettings)
        setExpandedBooks(prevExpanded => {
          const newSet = new Set(prevExpanded)
          newSet.delete(bookId)
          return newSet
        })
        setManuallyOverridden(prevOverridden => {
          const newSet = new Set(prevOverridden)
          newSet.delete(bookId)
          return newSet
        })
        return prev.filter(id => id !== bookId)
      } else {
        setBookSettings(prevSettings => ({
          ...prevSettings,
          [bookId]: {
            maxScore: Number(defaultMaxScore) || 100,
            passMarks: Number(defaultPassMarks) || 25
          }
        }))
        return [...prev, bookId]
      }
    })
  }

  const toggleExpanded = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedBooks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(bookId)) {
        newSet.delete(bookId)
      } else {
        newSet.add(bookId)
      }
      return newSet
    })
  }

  const updateBookSettings = (bookId: string, field: 'maxScore' | 'passMarks', value: string) => {
    const numValue = Number(value) || 0
    setBookSettings(prev => {
      const currentSettings = prev[bookId] || { maxScore: 100, passMarks: 25 }
      const newSettings = { ...currentSettings, [field]: numValue }
      
      if (field === 'maxScore') {
        newSettings.passMarks = Math.round(numValue * 0.25)
      }
      
      return { ...prev, [bookId]: newSettings }
    })
    setManuallyOverridden(prev => new Set([...prev, bookId]))
  }

  const updateNonOverriddenBooks = (newMax: number, newPass: number) => {
    setManuallyOverridden(prevOverridden => {
      setBookSettings(prevSettings => {
        const updated = { ...prevSettings }
        selectedIds.forEach(bookId => {
          if (!prevOverridden.has(bookId)) {
            updated[bookId] = { maxScore: newMax, passMarks: newPass }
          }
        })
        return updated
      })
      return prevOverridden
    })
  }

  const handleDefaultMaxScoreChange = (value: string) => {
    const newMax = Number(value) || 100
    const newPass = Math.round(newMax * 0.25)
    
    setDefaultMaxScore(value)
    setDefaultPassMarks(String(newPass))
    updateNonOverriddenBooks(newMax, newPass)
  }

  const handleDefaultPassMarksChange = (value: string) => {
    const newPass = Number(value) || 25
    const currentMax = Number(defaultMaxScore) || 100
    setDefaultPassMarks(value)
    updateNonOverriddenBooks(currentMax, newPass)
  }

  const applyDefaultsToAll = () => {
    const maxScore = Number(defaultMaxScore) || 100
    const passMarks = Number(defaultPassMarks) || Math.round(maxScore * 0.25)
    const newSettings: { [bookId: string]: BookSettings } = {}
    selectedIds.forEach(bookId => {
      newSettings[bookId] = { maxScore, passMarks }
    })
    setBookSettings(newSettings)
    setManuallyOverridden(new Set())
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(selectedIds, Number(defaultMaxScore) || 100, bookSettings)
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

  const getBookSettings = (bookId: string) => {
    return bookSettings[bookId] || { 
      maxScore: Number(defaultMaxScore) || 100, 
      passMarks: Number(defaultPassMarks) || 25 
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl w-[95vw] max-w-lg max-h-[85vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-slate-800 text-lg sm:text-xl font-bold">
            Select Books as Subjects
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Choose books for "{categoryName}" exam. Set individual marks for each subject.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 flex-shrink-0">
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Default Marks</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={applyDefaultsToAll}
                disabled={selectedIds.length === 0}
                className="text-xs h-7 px-2"
              >
                Apply to All
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-slate-500 whitespace-nowrap">Max:</span>
                <Input
                  type="number"
                  min="1"
                  value={defaultMaxScore}
                  onChange={(e) => handleDefaultMaxScoreChange(e.target.value)}
                  className="h-8 text-center border-slate-200 focus:border-emerald-500 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-slate-500 whitespace-nowrap">Pass:</span>
                <Input
                  type="number"
                  min="0"
                  value={defaultPassMarks}
                  onChange={(e) => handleDefaultPassMarksChange(e.target.value)}
                  className="h-8 text-center border-slate-200 focus:border-emerald-500 text-sm"
                />
              </div>
            </div>
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
              {filteredBooks.map((book) => {
                const isSelected = selectedIds.includes(book._id)
                const isExpanded = expandedBooks.has(book._id)
                const settings = getBookSettings(book._id)
                
                return (
                  <div key={book._id} className="space-y-0">
                    <div
                      onClick={() => toggleBook(book._id)}
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:bg-slate-50"
                      } ${isExpanded && isSelected ? "rounded-b-none border-b-0" : ""}`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-slate-300"
                      }`}>
                        {isSelected && (
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
                        {isSelected && (
                          <p className="text-xs text-emerald-600 mt-0.5">
                            Max: {settings.maxScore} | Pass: {settings.passMarks}
                          </p>
                        )}
                      </div>
                      
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => toggleExpanded(book._id, e)}
                          className="p-1 hover:bg-emerald-100 rounded transition-colors flex-shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    {isSelected && isExpanded && (
                      <div className="border border-t-0 border-emerald-500 bg-emerald-50/50 rounded-b-xl p-3 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs text-slate-600 whitespace-nowrap font-medium">Max Score:</span>
                            <Input
                              type="number"
                              min="1"
                              value={settings.maxScore}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateBookSettings(book._id, 'maxScore', e.target.value)}
                              className="h-8 text-center border-slate-200 focus:border-emerald-500 text-sm bg-white"
                            />
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs text-slate-600 whitespace-nowrap font-medium">Pass Marks:</span>
                            <Input
                              type="number"
                              min="0"
                              max={settings.maxScore}
                              value={settings.passMarks}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateBookSettings(book._id, 'passMarks', e.target.value)}
                              className="h-8 text-center border-slate-200 focus:border-emerald-500 text-sm bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
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
