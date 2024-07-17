function Feedback({ message, error = false }) {
  // const feedbackClass = error ? styles.error : styles.noError;

  return (
    <div>
      <img
        src={"../../" + (!error ? "correct.png" : "incorrect.png")}
        alt={!error ? "Ok" : "Error"}
      />
      <p>|</p>
      <p>{message}</p>
    </div>
  );

  //   return (
  //     <div className={`${styles.feedback} ${feedbackClass}`}>
  //       <img
  //         className={styles.icon}
  //         src={"../../" + (!error ? "correct.png" : "incorrect.png")}
  //         alt={error.toString()}
  //       />
  //       <p>|</p>
  //       <p>{message}</p>
  //     </div>
  //   );
}

export default Feedback;
