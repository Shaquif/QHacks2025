import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import '../calendar.css'; // Import your custom styles

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(() =>{
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ?JSON.parse(savedEvents) : {};
  });
  const [eventText, setEventText] = useState("");

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);
  
  const formattedDate = date.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD

  // Add an event for the selected date
  const handleAddEvent = () => {
    if (eventText.trim() !== "") {
      setEvents((prevEvents) => ({
        ...prevEvents,
        [formattedDate]: [...(prevEvents[formattedDate] || []), eventText]
      }));
      setEventText(""); // Clear input field
    }
  };

  // Function to show events on the calendar
  const tileContent = ({ date }) => {
    const formattedTileDate = date.toISOString().split("T")[0];
    return events[formattedTileDate] ? (
      <div className="event-marker">
        {events[formattedTileDate].map((event, index) => (
          <div key={index} className="event">
            {event}
          </div>
        ))}
      </div>
    ) : null;
  };

  return (
    <div className="calendar-container">
      <h2>Calendar</h2>
      <Calendar onChange={setDate} value={date} tileContent={tileContent} />
      <p>Selected date: {date.toDateString()}</p>

      {/* Event Input Section */}
      <div className="event-input">
        <input
          type="text"
          value={eventText}
          onChange={(e) => setEventText(e.target.value)}
          placeholder="Add an event..."
        />
        <button onClick={handleAddEvent}>Add Event</button>
      </div>
    </div>
  );
};

export default MyCalendar;