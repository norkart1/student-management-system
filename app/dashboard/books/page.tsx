"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { Spinner } from "@/components/spinner"
import { ImageUpload } from "@/components/image-upload"
import { BookOpen, BookText, User } from "lucide-react"

export default function BooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    imageUrl: "",
  })
  const [bookToEdit, setBookToEdit] = useState<any>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (bookToEdit) {
        const response = await fetch(`/api/books/${bookToEdit._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          resetForm()
          setDialogOpen(false)
          fetchBooks()
        }
      } else {
        const response = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          resetForm()
          setDialogOpen(false)
          fetchBooks()
        }
      }
    } catch (error) {
      console.error("Error saving book:", error)
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      imageUrl: "",
    })
    setBookToEdit(null)
  }

  const handleEditClick = (book: any) => {
    setBookToEdit(book)
    setFormData({
      title: book.title || "",
      author: book.author || "",
      imageUrl: book.imageUrl || "",
    })
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleDeleteClick = (book: any) => {
    setBookToDelete(book)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/books/${bookToDelete._id}`, { method: "DELETE" })
      if (response.ok) {
        setDeleteDialogOpen(false)
        setBookToDelete(null)
        fetchBooks()
      } else {
        console.error("Failed to delete book")
      }
    } catch (error) {
      console.error("Error deleting book:", error)
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: "imageUrl", label: "Cover", type: "image" as const, imageStyle: "book" as const },
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
  ]

  return (
    <ProtectedLayout>
      <div className="p-6 md:p-8 lg:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Books</h1>
              <p className="text-slate-500 text-sm md:text-base">Manage library books and inventory</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium">
              {books.length} Total Books
            </span>
          </div>
        </div>

        <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-800 text-lg">Library Books</CardTitle>
                <CardDescription className="text-slate-500">View and manage all library resources</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner message="Loading books..." />
              </div>
            ) : (
              <DataTable columns={columns} data={books} onEdit={handleEditClick} onDelete={handleDeleteClick} onAdd={() => setDialogOpen(true)} />
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-slate-800 text-xl font-bold">
                {bookToEdit ? "Edit Book" : "Add New Book"}
              </DialogTitle>
              <DialogDescription className="text-slate-500">Fill in the book details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                type="book"
              />

              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700 flex items-center gap-2">
                  <BookText className="w-4 h-4 text-emerald-600" />
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Author
                </Label>
                <Input
                  id="author"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md"
                >
                  {saving ? "Saving..." : (bookToEdit ? "Update Book" : "Save Book")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete Book"
          itemName={bookToDelete?.title}
          loading={deleting}
        />
      </div>
    </ProtectedLayout>
  )
}
