import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../assets/api-url";
import DeleteConfirmation from "./DeleteConfirmation";
import styles from "../styles/EventModal.module.css";

function EventEditingModal({
  event,
  fetchEvents,
  categories,
  setDisplayEditModal,
  setFeedbackMessage,
  setError,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: event.id,
    title: event.title,
    start_time: event.start_time,
    end_time: event.end_time,
    categoryName: "",
    categoryColor: "blue",
    body: event.body,
    status: event.status,
  });
  const [displayNewCategoryField, setDisplayNewCategoryField] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [displayConfirmationWindow, setDisplayConfirmationWindow] =
    useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // sets the initial state of formData
  useEffect(() => {
    const eventCategory = categories.filter(
      (category) => category.category_id === event.category_id
    );
    setFormData({ ...formData, categoryName: eventCategory[0].name });
  }, []);

  function handleInputChange(e) {
    if (e.target.name === "category") {
      setDisplayNewCategoryField(false);
      setFormData({ ...formData, categoryName: e.target.value });
      setNewCategoryName("");
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  }

  function handleNewCategoryChange(e) {
    setNewCategoryName(e.target.value);
    setFormData({ ...formData, categoryName: e.target.value });
  }

  function handleColorDropdownChange(color) {
    setFormData({ ...formData, categoryColor: color });
    setDropdownOpen(!dropdownOpen);
  }

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
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
                {categories.map((category) => (
                  <div
                    className={styles.categoryItem}
                    key={category.category_id}
                  >
                    <input
                      type="radio"
                      name="category"
                      id={category.category_id}
                      value={category.name}
                      checked={formData.categoryName === category.name}
                      onChange={handleInputChange}
                    />
                    <label htmlFor={category.category_id}>
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
              {displayNewCategoryField ? (
                <div className={styles.field}>
                  <label htmlFor="newCategory">New Category:</label>
                  <div className={styles.newCategory}>
                    <input
                      type="text"
                      name="newCategory"
                      id="newCategory"
                      value={newCategoryName}
                      onChange={handleNewCategoryChange}
                    />
                    <div className={styles.colorDropdownWrapper}>
                      <div
                        className={styles.colorDropdown}
                        onClick={toggleDropdown}
                      >
                        <img
                          src={`../../colors/${formData.categoryColor}.png`}
                          alt="Selected Color"
                          className={styles.selectedColor}
                        />
                      </div>
                      {dropdownOpen && (
                        <ul className={styles.dropdownList}>
                          {[
                            "blue",
                            "green",
                            "red",
                            "purple",
                            "orange",
                            "black",
                          ].map((color) => (
                            <li
                              key={color}
                              onClick={() => handleColorDropdownChange(color)}
                            >
                              <img
                                src={`../../colors/${color}.png`}
                                alt={color}
                                width="25"
                                height="25"
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
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
