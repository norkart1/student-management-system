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
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#329D9C] to-[#56C596] rounded-2xl flex items-center justify-center shadow-lg shadow-[#329D9C]/30">
            <BookOpen className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#205072]">Books Management</h1>
            <p className="text-[#329D9C]">Manage library books and inventory</p>
          </div>
        </div>

        <Card className="border border-[#CFF4D2] bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#205072]">Library Books</CardTitle>
            <CardDescription className="text-[#329D9C]">Total: {books.length} books</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
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
                  className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
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
                  className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn" className="text-[#205072]">ISBN</Label>
                <Input
                  id="isbn"
                  placeholder="Enter ISBN"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[#205072]">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
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
                  className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#205072]">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter shelf location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="border-[#CFF4D2] focus:border-[#329D9C] focus:ring-[#329D9C]"
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
