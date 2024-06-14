import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "./Calendar";
import EventCreationModal from "./EventCreationModal";
import EventEditingModal from "./EventEditingModal";
import Sidebar from "./Sidebar";
import API_URL from "../assets/api-url";

function Dashboard() {
  const navigate = useNavigate();

  const [displayEventModal, setDisplayEventModal] = useState(false);
  const [displayEditModal, setDisplayEditModal] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});

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
        setAllEvents(formattedEvents);
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
      const updatedCategories = [
        ...new Set(allEvents.map((event) => event.category)),
      ];

      const sortedCategories = updatedCategories.sort();
      const sortedAllCategories = allCategories.sort();

      const arraysEqual =
        sortedCategories.length === sortedAllCategories.length &&
        sortedCategories.every(
          (value, index) => value === sortedAllCategories[index]
        );

      if (arraysEqual) {
        filterEvents(filteredCategories);
      } else {
        if (updatedCategories.length > allCategories.length) {
          // new category added
          const missingCategory = updatedCategories.find(
            (category) => !allCategories.includes(category)
          );
          if (!filteredCategories.includes(missingCategory)) {
            setFilteredCategories([...filteredCategories, missingCategory]);
            filterEvents([...filteredCategories, missingCategory]);
          }
        } else {
          // category deleted
          const deletedCategory = allCategories.find(
            (category) => !updatedCategories.includes(category)
          );
          const updatedFilteredCategories = filteredCategories.filter(
            (category) => category !== deletedCategory
          );
          setFilteredCategories(updatedFilteredCategories);
          filterEvents(updatedFilteredCategories);
        }
        setAllCategories(updatedCategories);
      }
    }

    updateCategories();
  }, [allEvents]);

  function toggleEventModal() {
    displayEventModal
      ? setDisplayEventModal(false)
      : setDisplayEventModal(true);
  }

  function handleCategoryToggle(category, isChecked) {
    const newFilteredCategories = isChecked
      ? [...filteredCategories, category]
      : filteredCategories.filter((cat) => cat !== category);

    const uniqueFilteredCategories = [...new Set(newFilteredCategories)];

    setFilteredCategories(uniqueFilteredCategories);
    filterEvents(uniqueFilteredCategories);
  }

  function filterEvents(categoriesList) {
    const newFilteredEvents = allEvents.filter((event) =>
      categoriesList.includes(event.category)
    );

    setFilteredEvents(newFilteredEvents);
  }

  return (
    <div>
      <h2>You are logged in.</h2>
      <Sidebar
        categories={allCategories}
        toggleEventModal={toggleEventModal}
        onCategoryToggle={handleCategoryToggle}
      />
      {displayEventModal && (
        <EventCreationModal
          categories={allCategories}
          fetchEvents={fetchEvents}
          setDisplayEventModal={setDisplayEventModal}
          filteredCategories={filteredCategories}
          setFilteredCategories={setFilteredCategories}
        />
      )}
      {displayEditModal && (
        <EventEditingModal
          event={selectedEvent}
          fetchEvents={fetchEvents}
          categories={allCategories}
          setDisplayEditModal={setDisplayEditModal}
          filteredCategories={filteredCategories}
          setFilteredCategories={setFilteredCategories}
        />
      )}
      <Calendar
        events={filteredEvents}
        setSelectedEvent={setSelectedEvent}
        setDisplayEditModal={setDisplayEditModal}
      />
    </div>
  );
}

export default Dashboard;
