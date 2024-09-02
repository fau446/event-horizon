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
  const [newCategoryName, setNewCategoryName] = useState(category.name);
  const [displayConfirmationWindow, setDisplayConfirmationWindow] =
    useState(false);
  const [colorDropdownValue, setColorDropdownValue] = useState(category.color);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    onToggle(category, true);
  }, []);

  function handleCheckboxChange() {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onToggle(category, newCheckedState);
  }

  function handleEditFieldChange(e) {
    setNewCategoryName(e.target.value);
  }

  async function handleColorDropdownChange(newColorValue) {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/category/color`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: category.category_id,
          new_color: newColorValue,
        }),
      });

      if (response.ok) {
        fetchEvents();
        setError(false);
        toggleDropdown();
        setFeedbackMessage("Category color change successful!");
      }

      setColorDropdownValue(newColorValue);
    } catch (err) {
      setError(true);
      setFeedbackMessage("Error, server is down.");
    }
  }

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
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
        body: JSON.stringify({
          id: category.category_id,
          new_name: newCategoryName,
        }),
      });

      if (response.ok) {
        fetchEvents();
        setDisplayEditField(false);
        setError(false);
        setFeedbackMessage("Category name change successful!");

        category.name = newCategoryName;
        if (isChecked) onToggle(category, true);
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
        body: JSON.stringify({ id: category.category_id }),
      });

      if (response.ok) {
        fetchEvents();
        setError(false);
        setFeedbackMessage("Category successfully deleted!");
        setDisplayConfirmationWindow(false);
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
          name={category.name + "Checkbox"}
          id={category.category_id + "Checkbox"}
          onChange={handleCheckboxChange}
          checked={isChecked}
        />
        <div className={styles.colorDropdownWrapper}>
          <div className={styles.colorDropdown} onClick={toggleDropdown}>
            <img
              src={`../../colors/${colorDropdownValue}.png`}
              alt="Selected Color"
              className={styles.selectedColor}
            />
          </div>
          {dropdownOpen && (
            <ul className={styles.dropdownList}>
              {["blue", "green", "red", "purple", "orange", "black"].map(
                (color) => (
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
                )
              )}
            </ul>
          )}
        </div>
        {displayEditField ? (
          <input
            className="text"
            type="text"
            onChange={handleEditFieldChange}
            value={newCategoryName}
          />
        ) : (
          <label htmlFor={category.category_id + "Checkbox"}>
            {category.name}
          </label>
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
