import { useState, useEffect } from "react";
import API_URL from "../assets/api-url";

function CategoryItem({ category, onToggle, fetchEvents }) {
  const [isChecked, setIsChecked] = useState(true);
  const [displayEditField, setDisplayEditField] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category);

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
        Navigate("/login");
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

        // Makes sure that the events will not be filtered out if checkbox is checked
        if (isChecked) onToggle(newCategoryName, true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <input
        type="checkbox"
        name={category + "Checkbox"}
        id={category + "Checkbox"}
        onChange={handleCheckboxChange}
        checked={isChecked}
      />
      {displayEditField ? (
        <input
          type="text"
          onChange={handleInputChange}
          value={newCategoryName}
        ></input>
      ) : (
        <label htmlFor={category + "Checkbox"}>{category}</label>
      )}

      <div>
        {displayEditField ? (
          <button type="button" onClick={submitNameChange}>
            Done
          </button>
        ) : (
          <button type="button" onClick={openEditField}>
            Edit Name
          </button>
        )}
      </div>
    </div>
  );
}

export default CategoryItem;
