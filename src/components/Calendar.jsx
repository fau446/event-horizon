import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import API_URL from "../assets/api-url";

const localizer = momentLocalizer(moment);

function Calendar() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/events/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const jsonData = await response.json();
          const formattedEvents = jsonData.events_list.map((event) => ({
            ...event,
            start: new Date(event.start_time),
            end: new Date(event.end_time),
          }));
          setEvents(formattedEvents);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}

export default Calendar;
