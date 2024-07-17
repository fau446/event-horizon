import CategoryItem from "./CategoryItem";

function Sidebar({
  categories,
  toggleEventModal,
  onCategoryToggle,
  fetchEvents,
  setFeedbackMessage,
  setError,
}) {
  return (
    <div>
      <button onClick={toggleEventModal}>New Event</button>
      {categories.map((category, index) => (
        <div key={index}>
          <CategoryItem
            category={category}
            onToggle={onCategoryToggle}
            fetchEvents={fetchEvents}
            setFeedbackMessage={setFeedbackMessage}
            setError={setError}
          />
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
