import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Form from './Form';

export default function Events() {
  interface Event {
    _id: string;
    title: string;
    date: string;
    time: string;
    notes?: string; // Allow undefined to match backend
    category: 'Work' | 'Personal' | 'Other';
    archived: boolean;
  }

  type Category = 'Work' | 'Personal' | 'Other' | 'All';

  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<Category>('All');


  const fetcData = () => {
    fetch(`${import.meta.env.VITE_baseUrl}/events`)
      .then((res) => res.json())
      .then((response) => {
        // Check if response.data is an array
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error fetching events',
            text: 'Unexpected response format from server.',
          });
          setEvents([]);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error fetching events',
          text: error.message || 'Something went wrong.',
        });
        setEvents([]);
      });
  }
  useEffect(() => {
    fetcData()
  }, []);

  const filteredEvents = filter === 'All'
    ? events
    : events.filter((event) => event.category === filter);
  const categories: Category[] = ["All", "Work", "Personal", "Other"];

  return (
    <>
      <Form fetcData={fetcData} ></Form>
      <div className="font-light text-3xl p-4">Scheduled Events</div>
      <div className="space-y-4 p-4">
        <div className="flex flex-row gap-4">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filter === category}
                onChange={(e) => setFilter(e.target.value as Category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'
        >

          {filteredEvents.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            filteredEvents.map((event) => (

              <div
                key={event._id}
                className="p-4 flex items-center gap-5 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
              >
                <p className="text-sm text-gray-500">{event.date}</p>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800 mb-1">{event.title}</h1>
                  <p className="text-sm text-gray-500">{event.time}</p>
                  {event.notes && <p className="text-sm text-gray-500">{event.notes}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}