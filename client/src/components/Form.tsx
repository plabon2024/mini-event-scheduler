import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { format, isToday, isBefore } from "date-fns";

interface EventData {
  title: string;
  date: string;
  time: string;
  notes?: string;
  category: string;
}

export default function Form({ fetcData }: { fetcData: () => void }) {
  const [time, setTime] = useState('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Set initial time when date is today
  useEffect(() => {
    if (isToday(new Date(selectedDate))) {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      setTime(currentTime);
    } else {
      setTime('');
    }
  }, [selectedDate]);

  // Handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  // Validate time input
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = event.target.value;
    if (isToday(new Date(selectedDate))) {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const currentDateTime = new Date(`${selectedDate}T${currentTime}`);

      if (isBefore(selectedDateTime, currentDateTime)) {
        setTime(currentTime);
        Swal.fire({
          icon: "warning",
          title: "Invalid Time",
          text: "Cannot select a past time for today.",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
    }
    setTime(selectedTime);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const formDate = formData.get('date') as string;
    const formTime = time || (formData.get('time') as string);

    // Final validation before submission
    if (isToday(new Date(formDate))) {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      const selectedDateTime = new Date(`${formDate}T${formTime}`);
      const currentDateTime = new Date(`${formDate}T${currentTime}`);
      
      if (isBefore(selectedDateTime, currentDateTime)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Time",
          text: "Cannot schedule an event in the past.",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
    }

    const eventData: EventData = {
      title: formData.get('title') as string,
      date: formDate,
      time: formTime,
      notes: formData.get('notes') as string,
      category: formData.get('category') as string,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_baseUrl}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      form.reset();
      setTime("");
      setSelectedDate("");
      setShowForm(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Event Scheduled",
        showConfirmButton: false,
        timer: 1500
      });
      fetcData();
    } catch (error) {
      console.error('Failed to submit:', error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An error occurred while scheduling the event.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const currentTime = format(new Date(), "HH:mm");

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full mx-auto py-4 bg-white rounded-xl shadow-lg">
        <div className={`base-class ${showForm ? "text-end px-4" : "text-center"}`}>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-6 py-3 rounded-lg font-semibold ${showForm ? "bg-slate-400 hover:bg-slate-600" : ""}`}
          >
            {showForm ? "x" : "+ Add New Event"}
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out transform ${showForm ? "opacity-100 scale-100 max-h-[2000px]" : "opacity-0 scale-95 max-h-0"}`}>
          {showForm && (
            <form
              className="mt-8 space-y-6 p-4 lg:space-y-0 lg:flex lg:flex-wrap lg:justify-between lg:items-start gap-6"
              onSubmit={handleSubmit}
            >
              {/* Title */}
              <div className="flex-1">
                <label htmlFor="title" className="block mb-1 font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  placeholder="Event Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              {/* Date */}
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="date" className="block mb-1 font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  min={today}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                />
              </div>

              {/* Time */}
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="time" className="block mb-1 font-medium text-gray-700">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  id="time"
                  min={isToday(new Date(selectedDate)) ? currentTime : undefined}
                  value={time}
                  onChange={handleTimeChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div className="w-full">
                <label htmlFor="notes" className="block mb-1 font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={4}
                  placeholder="Additional details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none"
                />
              </div>

              {/* Category */}
              <div className="w-full">
                <label htmlFor="category" className="block mb-1 font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  readOnly
                  placeholder="Auto-assigned category"
                  className="w-full px-4 py-2 border border-gray-300 outline-none rounded-lg cursor-not-allowed text-gray-500"
                />
              </div>

              {/* Submit Button */}
              <div className="w-full">
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 transition-colors duration-300 text-white font-medium py-3 rounded-lg"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}