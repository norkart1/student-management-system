"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, FileText } from "lucide-react"

interface DataTableProps {
  columns: { key: string; label: string }[]
  data: any[]
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
  onAdd?: () => void
}

export function DataTable({ columns, data, onEdit, onDelete, onAdd }: DataTableProps) {
  const [search, setSearch] = useState("")

  const filteredData = data.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
          />
        </div>
        {onAdd && (
          <Button 
            onClick={onAdd} 
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/25 h-11 px-6 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Add New Record
          </Button>
        )}
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-200">
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold text-slate-700 py-4 text-sm">
                  {col.label}
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="font-semibold text-slate-700 py-4 text-sm w-32">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm text-slate-600 py-4">
                      {String(item[col.key] || "-")}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => onEdit(item)} 
                            title="Edit"
                            className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg"
                          >
                            <Pencil className="w-4 h-4 text-slate-500" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => onDelete(item)} 
                            title="Delete"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="text-center py-16 text-slate-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium">No records found</p>
                    <p className="text-sm">Try adjusting your search or add a new record</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-700">{filteredData.length}</span> of <span className="font-medium text-slate-700">{data.length}</span> records
        </div>
      </div>
    </div>
  )
}
