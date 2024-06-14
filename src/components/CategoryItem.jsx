import { useState, useEffect } from "react";

function CategoryItem({ category, onToggle }) {
  const [isChecked, setIsChecked] = useState(true);

  useEffect(() => {
    onToggle(category, true);
  }, []);

  function handleCheckboxChange() {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onToggle(category, newCheckedState);
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
      <label htmlFor={category + "Checkbox"}>{category}</label>
    </div>
  );
}

export default CategoryItem;
