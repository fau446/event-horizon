import { useCallback } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../styles/react-big-calendar.css";
import styles from "../styles/Calendar.module.css";

const localizer = momentLocalizer(moment);

function Calendar({ events, setSelectedEvent, setDisplayEditModal }) {
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setDisplayEditModal(true);
  }, []);

  const eventPropGetter = (event) => {
    let className = "";
    if (event.status === "complete") {
      className = "rbc-complete";
    }

    return { className };
  };

  return (
    <div className={styles.calendar}>
      <BigCalendar
        localizer={localizer}
        events={events}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventPropGetter}
        style={{ height: 500 }}
      />
    </div>
  );
}

export default Calendar;
