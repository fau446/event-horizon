import CategoryItem from "./CategoryItem";

function Sidebar({ categories, toggleEventModal, onCategoryToggle }) {
  return (
    <div>
      <button onClick={toggleEventModal}>New Event</button>
      {categories.map((category, index) => (
        <div key={index}>
          <CategoryItem category={category} onToggle={onCategoryToggle} />
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
