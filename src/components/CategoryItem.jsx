import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../assets/api-url";
import DeleteConfirmation from "./DeleteConfirmation";
import styles from "../styles/CategoryItem.module.css";

function CategoryItem({
  category,
  onToggle,
  fetchEvents,
  setFeedbackMessage,
  setError,
}) {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(true);
  const [displayEditField, setDisplayEditField] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category);
  const [displayConfirmationWindow, setDisplayConfirmationWindow] =
    useState(false);

  useEffect(() => {
    onToggle(category, true);
  }, []);

  function handleCheckboxChange() {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onToggle(category, newCheckedState);
  }

  function handleInputChange(e) {
    setNewCategoryName(e.target.value);
  }

  function openEditField() {
    setDisplayEditField(true);
  }

  async function submitNameChange() {
    if (category === newCategoryName) {
      setDisplayEditField(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/category/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ old_name: category, new_name: newCategoryName }),
      });

      if (response.ok) {
        fetchEvents();
        setDisplayEditField(false);
        setError(false);
        setFeedbackMessage("Category name change successful!");

        // Makes sure that the events will not be filtered out if checkbox is checked
        if (isChecked) onToggle(newCategoryName, true);
      }
    } catch (err) {
      setError(true);
      setFeedbackMessage("Error, server is down.");
    }
  }

  async function deleteCategory() {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/category/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: category }),
      });

      if (response.ok) {
        fetchEvents();
        setError(false);
        setFeedbackMessage("Category successfully deleted!");
      }
    } catch (err) {
      setError(true);
      setFeedbackMessage("Error, server is down.");
    }
  }

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        {displayConfirmationWindow && (
          <DeleteConfirmation
            deleteAction={deleteCategory}
            setDisplayConfirmationWindow={setDisplayConfirmationWindow}
          />
        )}
        <input
          className="checkbox"
          type="checkbox"
          name={category + "Checkbox"}
          id={category + "Checkbox"}
          onChange={handleCheckboxChange}
          checked={isChecked}
        />
        {displayEditField ? (
          <input
            className="text"
            type="text"
            onChange={handleInputChange}
            value={newCategoryName}
          ></input>
        ) : (
          <label htmlFor={category + "Checkbox"}>{category}</label>
        )}
      </div>

      <div className={styles.buttons}>
        {displayEditField ? (
          <img
            className="icon"
            src={"../../accept.png"}
            onClick={submitNameChange}
          />
        ) : (
          <img
            className="icon"
            src={"../../edit.png"}
            onClick={openEditField}
          />
        )}
        <img
          className="icon"
          src={"../../delete.png"}
          onClick={() => setDisplayConfirmationWindow(true)}
        />
      </div>
    </div>
  );
}

export default CategoryItem;
