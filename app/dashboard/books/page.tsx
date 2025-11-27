"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookOpen } from "lucide-react"

export default function BooksPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
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
    }
  }

  const handleDelete = async (book: any) => {
    if (confirm("Are you sure?")) {
      try {
        await fetch(`/api/books/${book._id}`, { method: "DELETE" })
        fetchBooks()
      } catch (error) {
        console.error("Error deleting book:", error)
      }
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
              <div className="text-center py-8 text-[#329D9C]">Loading...</div>
            ) : (
              <DataTable columns={columns} data={books} onDelete={handleDelete} onAdd={() => setDialogOpen(true)} />
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Fill in the book details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                placeholder="Author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
              <Input
                placeholder="ISBN"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              />
              <Input
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedLayout>
  )
}
