"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  selectedDate?: Date
  onDateChange?: (date: Date) => void
  className?: string
}

export function Calendar({ selectedDate, onDateChange, className = "" }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date()
  )
  const [selected, setSelected] = React.useState(selectedDate || new Date())

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelected(newDate)
    onDateChange?.(newDate)
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  
  const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0)
  const prevMonthDays = getDaysInMonth(prevMonth)
  const previousMonthDays = Array.from({ length: firstDay }, (_, i) => prevMonthDays - firstDay + i + 1)
  
  const totalCells = previousMonthDays.length + days.length
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
  const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => i + 1)

  const isSelectedDate = (day: number) => {
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth.getMonth() &&
      selected.getFullYear() === currentMonth.getFullYear()
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    )
  }

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4 text-teal-500" />
        </Button>
        
        <h2 className="text-lg font-semibold text-teal-500">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4 text-teal-500" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {previousMonthDays.map((day, idx) => (
          <div
            key={`prev-${idx}`}
            className="aspect-square flex items-center justify-center text-sm text-gray-300 font-medium"
          >
            {day}
          </div>
        ))}
        {days.map((day) => (
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            className={`aspect-square flex items-center justify-center text-sm rounded-full transition-all ${
              isSelectedDate(day)
                ? "bg-teal-500 text-white font-bold shadow-lg scale-110"
                : isToday(day)
                ? "bg-teal-100 text-teal-700 font-semibold"
                : "text-teal-600 hover:bg-teal-50 font-medium"
            }`}
          >
            {day}
          </button>
        ))}
        {nextMonthDays.map((day, idx) => (
          <div
            key={`next-${idx}`}
            className="aspect-square flex items-center justify-center text-sm text-gray-300 font-medium"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
