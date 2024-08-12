import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../assets/api-url";
import styles from "../styles/EventModal.module.css";

function EventCreationModal({
  categories,
  fetchEvents,
  setDisplayEventModal,
  filteredCategories,
  setFilteredCategories,
  setFeedbackMessage,
  setError,
}) {
  const navigate = useNavigate();

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

  function handleInputChange(e) {
    if (e.target.name === "category") {
      setDisplayNewCategoryField(false);
      setNewCategory("");
    }

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
      setError(true);
      setFeedbackMessage(
        `Please fill in the missing fields: ${emptyFields.join(", ")}`
      );
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
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
        setError(false);
        setFeedbackMessage("Event successfully created!");
        if (newCategory !== "") {
          setFilteredCategories([...filteredCategories, newCategory]);
        }
      }
    } catch (err) {
      setError(true);
      setFeedbackMessage("Error, server is down.");
    }
  }

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.content}>
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={styles.top}>
              <h2>Add Event</h2>
              <p
                className={styles.close}
                onClick={() => setDisplayEventModal(false)}
              >
                X
              </p>
            </div>
            <div className={styles.field}>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.times}>
              <div className={styles.time}>
                <label htmlFor="start_time">Start Time:</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  id="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.time}>
                <label htmlFor="end_time">End Time:</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  id="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.categorySection}>
              <label htmlFor="category">Category:</label>
              <div className={styles.categories}>
                {categories.map((category, index) => (
                  <div className={styles.categoryItem} key={index}>
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
              </div>
              {displayNewCategoryField ? (
                <div className={styles.field}>
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
            </div>
            <div className={styles.field}>
              <label htmlFor="body">Description:</label>
              <textarea
                name="body"
                id="body"
                cols="30"
                rows="10"
                value={formData.body}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.buttons}>
              <button type="button" onClick={() => setDisplayEventModal(false)}>
                Cancel
              </button>
              <button className={styles.confirm}>Add Event</button>
            </div>
          </form>
        </div>
      </div>
      <div
        className={styles.overlay}
        onClick={() => setDisplayEventModal(false)}
      ></div>
    </>
  );
}

export default EventCreationModal;
