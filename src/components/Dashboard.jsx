import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "./Calendar";
import EventCreationModal from "./EventCreationModal";
import API_URL from "../assets/api-url";

function Dashboard() {
  const navigate = useNavigate();

  const [displayEventModal, setDisplayEventModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    function updateCategories() {
      const allCategories = [...new Set(events.map((event) => event.category))];
      setCategories(allCategories);
    }

    updateCategories();
  }, [events]);

  function toggleEventModal() {
    displayEventModal
      ? setDisplayEventModal(false)
      : setDisplayEventModal(true);
  }

  return (
    <div>
      <h2>You are logged in.</h2>
      <button onClick={toggleEventModal}>New Event</button>
      {displayEventModal && (
        <EventCreationModal
          categories={categories}
          fetchEvents={fetchEvents}
          setDisplayEventModal={setDisplayEventModal}
        />
      )}
      <Calendar events={events} />
    </div>
  );
}

export default Dashboard;
