"use client"

import { ProtectedLayout } from "@/components/protected-layout"
import { Calendar } from "@/components/ui/calendar"
import { AddEventDialog } from "@/components/add-event-dialog"
import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Event {
  _id: string
  title: string
  date: string
  description?: string
  type: string
}

export default function CalendarPage() {
  const router = useRouter()
  const now = new Date()
  const [selectedDate, setSelectedDate] = useState(now)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  )

  useEffect(() => {
    fetchEvents()
  }, [currentMonth])

  const fetchEvents = async () => {
    try {
      const month = currentMonth.getMonth()
      const year = currentMonth.getFullYear()
      const response = await fetch(`/api/events?month=${month}&year=${year}`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Event deleted successfully")
        await fetchEvents()
      } else {
        toast.error("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Failed to delete event")
    }
  }

  const formatDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getEventsForDate = (date: Date) => {
    const dateString = formatDateString(date)
    return events.filter(event => event.date === dateString)
  }

  const selectedDateEvents = getEventsForDate(selectedDate)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-100 text-blue-700",
      holiday: "bg-red-100 text-red-700",
      exam: "bg-purple-100 text-purple-700",
      meeting: "bg-green-100 text-green-700",
      sports: "bg-orange-100 text-orange-700"
    }
    return colors[type] || colors.general
  }

  const getEventTypeIcon = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-emerald-500 p-4 md:p-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-white text-teal-600 hover:bg-white/90 rounded-full px-4 gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Event
            </Button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h1 className="text-xl font-semibold text-gray-800 text-center">
              Calendar
            </h1>
            <p className="text-sm text-gray-500 text-center mt-1">
              {formatDate(selectedDate)}
            </p>
          </div>

          <Calendar 
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            onDateChange={setSelectedDate}
            onMonthChange={setCurrentMonth}
            events={events}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Events on {selectedDate.getDate()}
              </h2>
              <span className="text-white/80 text-sm">
                {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'event' : 'events'}
              </span>
            </div>
            
            {loading ? (
              <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
                Loading events...
              </div>
            ) : selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEvent(event._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No events on this date</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click "Add Event" to create one
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddEventDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        selectedDate={selectedDate}
        onEventAdded={fetchEvents}
      />
    </ProtectedLayout>
  )
}
