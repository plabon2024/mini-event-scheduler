import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Form from './Form';

import { MdDelete } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';

export default function Events() {
  interface Event {
    _id: string;
    title: string;
    date: string;
    time: string;
    notes?: string;
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
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
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
    
    
    const categories: Category[] = ["All", "Work", "Personal", "Other"];
    const [showArchived, setShowArchived] = useState(false);



  // archive
  const archiveEvent = async (id: string, status: boolean) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_baseUrl}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: !status }),
      })
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: `${showArchived ? "Event Unarchived" : "Event Archived"}`,
          showConfirmButton: false
        });

      }
      fetcData()

    } catch (error) {
      console.log(error)
    }
  }

  const displayedEvents = events.filter(event => {
    if (showArchived) {
      return event.archived === true;
    } else {
      return event.archived === false && (filter === 'All' || event.category === filter);
    }
  });

  

  return (
    <>
      <Form fetcData={fetcData} ></Form>
      <div className="font-light text-3xl p-4">Scheduled Events</div>
      <div className="space-y-4 p-4">
        <div className='flex justify-between'>
          {!showArchived && <div className="flex flex-row gap-4">
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
          </div>}

          <button
            onClick={() => setShowArchived(!showArchived)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded ms-auto"
          >
            {showArchived ? 'Show Active Events' : 'Show Archived Events'}
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'
        >

          {displayedEvents.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            displayedEvents.map((event) => (

              <div
                key={event._id}
                className="p-4 flex items-center gap-5 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
              >
                <p className="text-sm text-gray-500">{event.date}</p>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800 mb-1">{event.title}</h1>
                  <p className="text-sm text-gray-500">{event.time}</p>
                  {event.notes && <p className="text-sm text-gray-500">{event.notes}</p>}

                </div><div className='flex flex-col justify-center items-center gap-5'>
                  <div onClick={() => archiveEvent(event._id, event.archived)} className='p-2 rounded-md hover:bg-gray-300'>

                    <RxCross1 size={22} />

                  </div>
                  <div className='p-2 rounded-md hover:bg-red-400 '>
                    <MdDelete size={25} />

                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}