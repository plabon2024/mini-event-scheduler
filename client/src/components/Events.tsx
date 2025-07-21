import  { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Form from './Form';

import { MdDelete } from 'react-icons/md';

import { RiArchive2Fill, RiInboxArchiveFill, RiInboxUnarchiveFill } from 'react-icons/ri';
import { format, parse } from 'date-fns';

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

  // delete 
  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        const res = await fetch(`${import.meta.env.VITE_baseUrl}/events/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "Event has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1000
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the Event.",
            icon: "error"
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error"
      });
      console.error(error);
    } finally {
      fetcData()
    }
  };



  return (
    <>
      <Form fetcData={fetcData} ></Form>
      <div className="font-light text-3xl p-4">Scheduled Events</div>
      <div className="space-y-4 p-4">
        <div className='flex justify-between flex-col md:flex-row'>
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
            className="px-4 py-2 text-xl font-light bg-slate-300  rounded me-auto md:me-0  md:ms-auto"
          >
            {showArchived
              ? 'Show Active Events' : (<div className='flex items-center'> <RiArchive2Fill style={{ marginRight: '4px' }} /> <span>Archive</span></div>
              )}</button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'
        >

          {displayedEvents.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
          ) : (
            displayedEvents.map((event) => (

              <div key={event._id} className="p-4 md:grid md:grid-cols-12  justify-center shadow-2xl rounded-md transition-shadow duration-300 bg-white">

                <div className="col-span-12">
                  <div className='flex items-center justify-between gap-2'>

                    <h1 className="text-xl  text-gray-900 mb-2 font-semibold capitalize">{event.title} </h1>
                    <div className=" flex justify-end ">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => archiveEvent(event._id, event.archived)}
                          className="p-2 rounded-md hover:bg-gray-200 focus:outline-none "
                          aria-label={showArchived ? 'Unarchive' : 'Archive'}
                          title={showArchived ? 'Unarchive' : 'Archive'}
                        >
                          {showArchived ? <RiInboxUnarchiveFill size={24} /> : <RiInboxArchiveFill size={24} />}
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-2 rounded-md hover:bg-red-500 hover:text-white focus:outline-none"
                          aria-label="Delete"
                          title="Delete"
                        >
                          <MdDelete size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {format(new Date(event.date), "MMMM dd, yyyy")} at {format(parse(event.time, 'HH:mm', new Date()), 'hh:mm a')}
                  </p>

                  {event.notes && <p className="text-sm text-gray-500 italic">{event.notes}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}