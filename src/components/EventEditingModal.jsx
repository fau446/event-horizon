import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../assets/api-url";
import DeleteConfirmation from "./DeleteConfirmation";
import styles from "../styles/EventModal.module.css";

function EventEditingModal({
  event,
  fetchEvents,
  categories,
  setDisplayEditModal,
  filteredCategories,
  setFilteredCategories,
  setFeedbackMessage,
  setError,
}) {
  const navigate = useNavigate();

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
  const [displayConfirmationWindow, setDisplayConfirmationWindow] =
    useState(false);

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
        navigate("/login");
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
        setError(false);
        setFeedbackMessage("Event successfully edited!");
        if (newCategory !== "") {
          setFilteredCategories([...filteredCategories, newCategory]);
        }
      }
    } catch (err) {
      setError(true);
      setFeedbackMessage("Error, server is down.");
    }
  }

  async function deleteEvent() {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
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
        setError(false);
        setFeedbackMessage("Event successfully deleted!");
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
          {displayConfirmationWindow && (
            <DeleteConfirmation
              deleteAction={deleteEvent}
              setDisplayConfirmationWindow={setDisplayConfirmationWindow}
            />
          )}

          <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={styles.top}>
              <h2>Edit Event</h2>
              <p
                className={styles.close}
                onClick={() => setDisplayEditModal(false)}
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
            {formData.status === "complete" ? (
              <button type="button" onClick={toggleMarkAsComplete}>
                Mark as Incomplete
              </button>
            ) : (
              <button type="button" onClick={toggleMarkAsComplete}>
                Mark as Complete
              </button>
            )}
            <div className={styles.buttons}>
              <button type="button" onClick={() => setDisplayEditModal(false)}>
                Cancel
              </button>
              <button
                className={styles.delete}
                type="button"
                onClick={() => setDisplayConfirmationWindow(true)}
              >
                Delete event
              </button>
              <button className={styles.confirm}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>
      <div
        className={styles.overlay}
        onClick={() => setDisplayEditModal(false)}
      ></div>
    </>
  );
}

export default EventEditingModal;
