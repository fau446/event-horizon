import styles from "../styles/Feedback.module.css";

function Feedback({ message, error = false }) {
  const feedbackClass = error ? styles.error : styles.noError;

  return (
    <div className={`${styles.feedback} ${feedbackClass}`}>
      <img
        className={styles.icon}
        src={"../../" + (!error ? "accept.png" : "incorrect.png")}
        alt={!error ? "Ok" : "Error"}
      />
      <p>|</p>
      <p>{message}</p>
    </div>
  );
}

export default Feedback;
