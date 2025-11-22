"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Event {
  _id: string
  title: string
  date: string
  description?: string
  type: string
}

interface CalendarProps {
  selectedDate?: Date
  currentMonth: Date
  onDateChange?: (date: Date) => void
  onMonthChange?: (date: Date) => void
  events?: Event[]
  className?: string
}

export function Calendar({ selectedDate, currentMonth, onDateChange, onMonthChange, events = [], className = "" }: CalendarProps) {
  const selected = selectedDate || new Date()

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
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    onMonthChange?.(newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    onMonthChange?.(newMonth)
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
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

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const isSelectedDate = (day: number) => {
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return isSameDay(selected, dayDate)
  }

  const isToday = (day: number) => {
    const today = new Date()
    const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return isSameDay(today, dayDate)
  }

  const formatDateString = (year: number, month: number, day: number) => {
    const paddedMonth = String(month + 1).padStart(2, '0')
    const paddedDay = String(day).padStart(2, '0')
    return `${year}-${paddedMonth}-${paddedDay}`
  }

  const hasEvents = (day: number) => {
    const dayString = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return events.some(event => event.date === dayString)
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
            className={`aspect-square flex flex-col items-center justify-center text-sm rounded-full transition-all relative ${
              isSelectedDate(day)
                ? "bg-teal-500 text-white font-bold shadow-lg scale-110"
                : isToday(day)
                ? "bg-teal-100 text-teal-700 font-semibold"
                : "text-teal-600 hover:bg-teal-50 font-medium"
            }`}
          >
            <span>{day}</span>
            {hasEvents(day) && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-current opacity-70" />
            )}
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
