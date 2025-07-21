import React, { useState } from "react";
import Swal from "sweetalert2";
interface EventData {
  title: string;
  date: string;
  time: string;
  notes?: string;
  category: string;
}
export default function Form({ fetcData }) {
  const [time, setTime] = useState('');
  const [showForm, setShowForm] = useState<boolean>(false);


  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    const today = new Date().toISOString().split('T')[0];

    if (date === today) {
      const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5);  // "HH:mm"

      setTime(currentTime);

    } else {
      setTime("");
    }
  };

  const updateTimeIfToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5);  // "HH:mm"

    const selectedDate = document.querySelector<HTMLInputElement>('input[name="date"]')?.value;

    if (selectedDate === today) {
      setTime(currentTime);
    } else {
      setTime('');
    }
  };



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTimeIfToday()
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const eventData: EventData = {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      notes: formData.get('notes') as string,
      category: formData.get('category') as string,
    };
    for (const [name, value] of formData.entries()) {
      console.log(name, value)
    }


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
      Swal.fire({
        position: "center",
        icon: "success",
        title: " Event Scheduled",
        showConfirmButton: false,
        timer: 1500
      });
      fetcData()
      // setShowForm(false);
    } catch (error) {
      console.error('Failed to submit:', error);
    }

  };


  return (
    <div className=" flex items-center justify-center p-4">

      <div className="w-full  mx-auto py-4 bg-white rounded-xl shadow-lg">
        <div className={`base-class ${showForm ? "text-end " : "text-center"}`}>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white px-6 py-3 rounded-lg font-semibold ${showForm ? "bg-slate-400 hover:bg-slate-600" : ""} `}
          >
            {showForm ? "x" : "+ Add New Event"}
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out transform ${showForm ? "opacity-100 scale-100 max-h-[2000px]" : "opacity-0 scale-95 max-h-0"
          }`}>
          {showForm && (
            <form
              className="mt-8 space-y-6 p-4 lg:space-y-0 lg:flex lg:flex-wrap lg:justify-between lg:items-start gap-6 "
              onSubmit={handleSubmit}

            >
              {/* Title */}
              <div className="flex-1 ">
                <label htmlFor="title" className="block mb-1 font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  placeholder="Event Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none "
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
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleTimeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none "
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
                  min={time}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none "
                />
              </div>

              {/* Notes (Full width) */}
              <div className="w-full">
                <label htmlFor="notes" className="block mb-1 font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={4}
                  placeholder="Additional details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none "
                />
              </div>

              {/* Category (Full width) */}
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
                  className="w-full px-4 py-2 border border-gray-300 outline-none  rounded-lg cursor-not-allowed text-gray-500"
                />
              </div>

              {/* Submit Button */}
              <div className="w-full">


                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 transition-colors duration-300 text-white font-medium py-3 rounded-lg   "
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
