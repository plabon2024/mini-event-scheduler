import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function Header() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedDate = format(now, "MMMM dd, yyyy");  // Example: July 21, 2025
      const formattedTime = format(now, "hh:mm a");        // Example: 04:30 PM

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    updateClock(); // Initialize immediately

    const interval = setInterval(updateClock, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="flex">
      <div className="flex gap-4 justify-center items-center p-4">
        <div className="w-10">
          <img src="/event.png" alt="" />
        </div>
        <div className="flex flex-col">
          <span className="font-light text-2xl">{currentTime}</span>
          <span className="font-light">{currentDate}</span>
        </div>
      </div>
    </div>
  );
}
