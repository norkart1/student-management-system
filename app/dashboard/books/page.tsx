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
import { BookOpen } from "lucide-react"

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
    isbn: "",
    category: "",
    quantity: "",
    location: "",
  })

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
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setFormData({
          title: "",
          author: "",
          isbn: "",
          category: "",
          quantity: "",
          location: "",
        })
        setDialogOpen(false)
        fetchBooks()
      }
    } catch (error) {
      console.error("Error adding book:", error)
    } finally {
      setSaving(false)
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
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "isbn", label: "ISBN" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Quantity" },
    { key: "location", label: "Location" },
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
              <DataTable columns={columns} data={books} onDelete={handleDeleteClick} onAdd={() => setDialogOpen(true)} />
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="border-[#CFF4D2]">
            <DialogHeader>
              <DialogTitle className="text-[#205072]">Add New Book</DialogTitle>
              <DialogDescription className="text-[#329D9C]">Fill in the book details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#205072]">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author" className="text-[#205072]">Author</Label>
                <Input
                  id="author"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn" className="text-[#205072]">ISBN</Label>
                <Input
                  id="isbn"
                  placeholder="Enter ISBN"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[#205072]">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-[#205072]">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#205072]">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter shelf location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="!border-[#CFF4D2] focus-visible:!border-[#329D9C] focus-visible:!ring-[#329D9C]"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="border-[#CFF4D2] text-[#205072] hover:bg-[#CFF4D2]/30"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-gradient-to-r from-[#329D9C] to-[#56C596] hover:from-[#205072] hover:to-[#329D9C] text-white"
                >
                  {saving ? "Saving..." : "Save Book"}
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
