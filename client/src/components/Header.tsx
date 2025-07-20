import { useEffect, useState } from "react";

export default function Header() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const formattedDate = new Date().toLocaleDateString('en-US', {
        month: "long",
        day: "2-digit",
        year: "numeric"
      });
      const formattedTime = new Date().toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };
    updateDate(); 
    
    const interval = setInterval(updateDate, 30000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="flex">
      <div className="flex gap-4 justify-center items-center p-4">

        <div className="w-10">
          <img src="/event.png" alt="" />
        </div>
        <div className="flex flex-col">
          <span className="font-light text-2xl">
            {currentTime}
          </span>
          <span className="font-light">
{currentDate}          </span>
        </div>
      </div>


    </div>
  )
}
