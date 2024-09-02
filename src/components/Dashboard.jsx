import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "./Calendar";
import EventCreationModal from "./EventCreationModal";
import EventEditingModal from "./EventEditingModal";
import Sidebar from "./Sidebar";
import Nav from "./Nav";
import Feedback from "./Feedback";
import API_URL from "../assets/api-url";
import styles from "../styles/Dashboard.module.css";

function Dashboard({ loggedInUser }) {
  const navigate = useNavigate();

  const [displayEventModal, setDisplayEventModal] = useState(false);
  const [displayEditModal, setDisplayEditModal] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [error, setError] = useState(false);

  // used to update filteredCategories during initial render
  const updateArray = filteredCategories;

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
      setError(true);
      setFeedbackMessage("Error, server is down.");
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    function updateCategories(categories) {
      const updatedCategories = [
        ...new Set(allEvents.map((event) => event.category_id)),
      ];

      const sortedCategories = updatedCategories.sort();
      const sortedAllCategories = categories
        .map((category) => category.category_id)
        .sort();

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
        }
      }
      filterEvents(filteredCategories);
      setAllCategories(categories);
    }

    async function fetchAndUpdateCategories() {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/category/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const jsonData = await response.json();
          updateCategories(jsonData.category_list);
        }
      } catch (err) {
        setError(true);
        setFeedbackMessage("Error, server is down.");
      }
    }

    fetchAndUpdateCategories();
  }, [allEvents]);

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  function toggleEventModal() {
    displayEventModal
      ? setDisplayEventModal(false)
      : setDisplayEventModal(true);
  }

  function handleCategoryToggle(category, isChecked) {
    let updateArrayCopy = updateArray;
    if (!isChecked) {
      updateArrayCopy = updateArrayCopy.filter(
        (item) => item.category_id !== category.category_id
      );
    } else {
      if (
        !updateArrayCopy.some(
          (item) => item.category_id === category.category_id
        )
      ) {
        updateArrayCopy.push(category);
      }
    }

    setFilteredCategories(updateArrayCopy);
    filterEvents(updateArrayCopy);
  }

  function filterEvents(categoriesList) {
    const categoryIds = categoriesList.map((category) => category.category_id);

    const newFilteredEvents = allEvents.filter((event) =>
      categoryIds.includes(event.category_id)
    );

    setFilteredEvents(newFilteredEvents);
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.nav}>
        <Nav loggedInUser={loggedInUser} />
      </div>
      {feedbackMessage !== "" && (
        <Feedback message={feedbackMessage} error={error} />
      )}
      <div className={styles.sidebar}>
        <Sidebar
          categories={allCategories}
          toggleEventModal={toggleEventModal}
          onCategoryToggle={handleCategoryToggle}
          fetchEvents={fetchEvents}
          setFeedbackMessage={setFeedbackMessage}
          setError={setError}
        />
      </div>
      {displayEventModal && (
        <EventCreationModal
          categories={allCategories}
          fetchEvents={fetchEvents}
          setDisplayEventModal={setDisplayEventModal}
          setFeedbackMessage={setFeedbackMessage}
          setError={setError}
        />
      )}
      {displayEditModal && (
        <EventEditingModal
          event={selectedEvent}
          fetchEvents={fetchEvents}
          categories={allCategories}
          setDisplayEditModal={setDisplayEditModal}
          setFeedbackMessage={setFeedbackMessage}
          setError={setError}
        />
      )}
      <Calendar
        events={filteredEvents}
        allCategories={allCategories}
        setSelectedEvent={setSelectedEvent}
        setDisplayEditModal={setDisplayEditModal}
      />
    </div>
  );
}

export default Dashboard;
