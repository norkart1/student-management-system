"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  loading?: boolean
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Record",
  description = "Are you sure you want to delete this record? This action cannot be undone.",
  itemName,
  loading = false,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md w-[calc(100%-2rem)] mx-auto p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                <Trash2 className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-slate-800 text-xl font-bold">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-slate-500 mt-1">
                  {itemName ? (
                    <>Are you sure you want to delete <span className="font-semibold text-slate-700">"{itemName}"</span>? This action cannot be undone.</>
                  ) : (
                    description
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>
        
        <div className="flex gap-3 p-4 bg-slate-50/80 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 h-11 font-medium rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-11 font-medium rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/25 transition-all"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
