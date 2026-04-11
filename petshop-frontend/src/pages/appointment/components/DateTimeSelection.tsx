import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  AlertTriangle,
  Info,
} from "lucide-react"; // Added Info

interface DateTimeSelectionProps {
  selectedDate: string;
  selectedTime: string;
  availableTimeSlots: string[];
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  errors: Record<string, string>;
  serviceDuration?: number; // Optional: to provide context
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  availableTimeSlots,
  onSelectDate,
  onSelectTime,
  errors,
  serviceDuration,
}) => {
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const generateCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight for comparison

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

    const days = [];

    // Add blank cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, date: null, isPast: true, isToday: false });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      currentDate.setHours(0, 0, 0, 0); // Normalize current date for comparison
      const dateStr = currentDate.toISOString().split("T")[0];

      days.push({
        day: i,
        date: dateStr,
        isToday: currentDate.getTime() === today.getTime(),
        isPast: currentDate.getTime() < today.getTime(),
      });
    }
    return days;
  };

  const prevMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
    );
  };

  const formatTimeSlot = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const days = generateCalendarDays();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">
          Select Date & Time
        </h2>
        <p className="text-slate-600 mt-2 text-lg">
          Choose an available slot for your appointment.
          {serviceDuration && (
            <span className="block text-sm text-blue-600 mt-1">
              Appointment duration: ~{serviceDuration} minutes.
            </span>
          )}
        </p>
      </div>

      {(errors.date || errors.time) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700">
          <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            {errors.date && (
              <p className="text-sm font-medium">{errors.date}</p>
            )}
            {errors.time && (
              <p className="text-sm font-medium mt-1">{errors.time}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Calendar Section */}
        <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-semibold text-slate-800">
              {calendarMonth.toLocaleString("default", { month: "long" })}{" "}
              {calendarMonth.getFullYear()}
            </h3>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-500 font-medium mb-2">
            {dayNames.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((dayObj, index) => (
              <div
                key={index}
                className="aspect-square flex items-center justify-center"
              >
                {dayObj.day && (
                  <button
                    type="button"
                    disabled={dayObj.isPast}
                    onClick={() => dayObj.date && onSelectDate(dayObj.date)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                      ${
                        dayObj.isPast
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-700 hover:bg-blue-100"
                      }
                      ${
                        dayObj.date === selectedDate
                          ? "bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700"
                          : ""
                      }
                      ${
                        dayObj.isToday &&
                        dayObj.date !== selectedDate &&
                        !dayObj.isPast
                          ? "border-2 border-blue-500 text-blue-600 font-medium"
                          : ""
                      }
                      ${
                        dayObj.isToday && dayObj.isPast
                          ? "border-2 border-slate-300"
                          : ""
                      }
                    `}
                  >
                    {dayObj.day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Time Slot Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 mb-1">
            Available Times
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            {selectedDate
              ? `For ${new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "en-US",
                  { weekday: "long", month: "long", day: "numeric" }
                )}`
              : "Please select a date first"}
          </p>

          {selectedDate ? (
            availableTimeSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2 styled-scrollbar">
                {availableTimeSlots.map((timeSlot) => (
                  <button
                    key={timeSlot}
                    type="button"
                    onClick={() => onSelectTime(timeSlot)}
                    className={`w-full py-3 px-2 text-sm border rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 flex items-center justify-center gap-2
                      ${
                        selectedTime === timeSlot
                          ? "bg-blue-600 text-white border-blue-600 shadow-md font-medium"
                          : "border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                  >
                    <Clock size={16} />
                    {formatTimeSlot(timeSlot)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-8">
                <CalendarDays className="h-12 w-12 text-slate-400 mb-4" />
                <p className="font-medium">No time slots available.</p>
                <p className="text-sm">Please try a different date.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-8">
              <CalendarDays className="h-12 w-12 text-slate-400 mb-4" />
              <p className="font-medium">Select a date</p>
              <p className="text-sm">Available time slots will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
