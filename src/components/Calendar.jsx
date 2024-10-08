import { useCallback } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../styles/react-big-calendar.css";
import styles from "../styles/Calendar.module.css";

const localizer = momentLocalizer(moment);

function Calendar({
  events,
  allCategories,
  setSelectedEvent,
  setDisplayEditModal,
}) {
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setDisplayEditModal(true);
  }, []);

  const eventPropGetter = (event) => {
    let className = "";

    // find the category color using allCategories
    const matchingCategory = allCategories.find(
      (category) => category.category_id === event.category_id
    );

    className += matchingCategory.color;

    if (event.status === "complete") {
      className += " rbc-complete";
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
        style={{ height: "100%" }}
      />
    </div>
  );
}

export default Calendar;
