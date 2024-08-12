import CategoryItem from "./CategoryItem";
import styles from "../styles/Sidebar.module.css";

function Sidebar({
  categories,
  toggleEventModal,
  onCategoryToggle,
  fetchEvents,
  setFeedbackMessage,
  setError,
}) {
  return (
    <>
      <div className={styles.newButton}>
        <button onClick={toggleEventModal}>
          <img className="icon" src={"../../add.png"} />
          New Event
        </button>
      </div>
      <div className={styles.list}>
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
    </>
  );
}

export default Sidebar;
