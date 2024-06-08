import { useState } from "react";
import API_URL from "../assets/api-url";

function EventEditingModal({
  event,
  fetchEvents,
  categories,
  setDisplayEditModal,
}) {
  const [formData, setFormData] = useState({
    id: event.id,
    title: event.title,
    start_time: event.start_time,
    end_time: event.end_time,
    category: event.category,
    body: event.body,
    status: event.status,
  });
  const [displayNewCategoryField, setDisplayNewCategoryField] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  function handleInputChange(e) {
    if (e.target.name === "category") setDisplayNewCategoryField(false);

    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleNewCategoryChange(e) {
    setNewCategory(e.target.value);
    setFormData({ ...formData, category: e.target.value });
  }

  function toggleMarkAsComplete() {
    formData.status === "complete"
      ? setFormData({ ...formData, ["status"]: "incomplete" })
      : setFormData({ ...formData, ["status"]: "complete" });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        Navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/events/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchEvents();
        setDisplayEditModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteEvent() {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        Navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/events/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: formData.id }),
      });

      if (response.ok) {
        fetchEvents();
        setDisplayEditModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h2>Edit Event</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <label htmlFor="start_time">Start Time:</label>
        <input
          type="datetime-local"
          name="start_time"
          id="start_time"
          value={formData.start_time}
          onChange={handleInputChange}
        />
        <label htmlFor="end_time">End Time:</label>
        <input
          type="datetime-local"
          name="end_time"
          id="end_time"
          value={formData.end_time}
          onChange={handleInputChange}
        />
        <label htmlFor="category">Category:</label>
        {categories.map((category, index) => (
          <div key={index}>
            <input
              type="radio"
              name="category"
              id={category}
              value={category}
              checked={formData.category === category}
              onChange={handleInputChange}
            />
            <label htmlFor={category}>{category}</label>
          </div>
        ))}
        {displayNewCategoryField ? (
          <div>
            <label htmlFor="newCategory">New Category:</label>
            <input
              type="text"
              name="newCategory"
              id="newCategory"
              value={newCategory}
              onChange={handleNewCategoryChange}
            />
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setDisplayNewCategoryField(true)}
            >
              Add new category
            </button>
          </div>
        )}
        <label htmlFor="body">Description:</label>
        <textarea
          name="body"
          id="body"
          cols="30"
          rows="10"
          value={formData.body}
          onChange={handleInputChange}
        />

        {formData.status === "complete" ? (
          <button type="button" onClick={toggleMarkAsComplete}>
            Mark as Incomplete
          </button>
        ) : (
          <button type="button" onClick={toggleMarkAsComplete}>
            Mark as Complete
          </button>
        )}
        <button type="button" onClick={deleteEvent}>
          Delete event
        </button>
        <button>Save Changes</button>
      </form>
    </div>
  );
}

export default EventEditingModal;
