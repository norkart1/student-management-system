"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

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
      <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg p-0 overflow-hidden rounded-2xl border-0 shadow-2xl mx-4">
        <div className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogHeader className="items-center text-center space-y-3 sm:space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center shadow-lg shadow-red-100">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-inner">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" strokeWidth={2} />
              </div>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 pt-1 sm:pt-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-center text-sm sm:text-base leading-relaxed max-w-sm px-2">
              {itemName ? (
                <>Are you sure you want to delete <span className="font-semibold text-gray-800">"{itemName}"</span>? This action cannot be undone.</>
              ) : (
                description
              )}
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="flex flex-row gap-3 sm:gap-4 p-4 sm:p-6 pt-3 sm:pt-4 bg-gray-50/50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base font-medium rounded-xl border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base font-medium rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 transition-all"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
