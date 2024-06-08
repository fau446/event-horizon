import { useCallback } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function Calendar({ events, setSelectedEvent, setDisplayEditModal }) {
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setDisplayEditModal(true);
  }, []);

  return (
    <div>
      <BigCalendar
        localizer={localizer}
        events={events}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}

export default Calendar;
