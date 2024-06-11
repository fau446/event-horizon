import { useState } from "react";
import API_URL from "../assets/api-url";

function EventCreationModal({ categories, fetchEvents, setDisplayEventModal }) {
  const [formData, setFormData] = useState({
    title: "",
    start_time: "",
    end_time: "",
    category: "",
    body: "",
    status: "incomplete",
  });
  const [displayNewCategoryField, setDisplayNewCategoryField] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleInputChange(e) {
    if (e.target.name === "category") setDisplayNewCategoryField(false);

    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleNewCategoryChange(e) {
    setNewCategory(e.target.value);
    setFormData({ ...formData, category: e.target.value });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const requiredFields = [
      "title",
      "start_time",
      "end_time",
      "category",
      "body",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      setErrorMessage(
        `Please fill in the missing fields: ${emptyFields.join(", ")}`
      );
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        Navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/events/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchEvents();
        setDisplayEventModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  console.log(errorMessage);

  return (
    <div>
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

        <button>Add Event</button>
      </form>
    </div>
  );
}

export default EventCreationModal;
