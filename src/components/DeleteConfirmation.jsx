import styles from "../styles/DeleteConfirmation.module.css";

function DeleteConfirmation({
  deleteAction,
  setDisplayConfirmationWindow,
  disableButtons,
}) {
  return (
    <>
      <div className={styles.modal}>
        <div className={styles.top}>
          <h2>Delete?</h2>
          <p
            className={styles.close}
            onClick={() => setDisplayConfirmationWindow(false)}
          >
            X
          </p>
        </div>
        <p className={styles.message}>Are you sure you want to delete this?</p>
        <div className={styles.buttons}>
          <button
            onClick={() => setDisplayConfirmationWindow(false)}
            type="button"
          >
            Cancel
          </button>
          <button
            className={styles.deleteBtn}
            onClick={deleteAction}
            type="button"
            disabled={disableButtons}
          >
            Delete
          </button>
        </div>
      </div>
      <div
        className={styles.overlay}
        onClick={() => setDisplayConfirmationWindow(false)}
      ></div>
    </>
  );
}

export default DeleteConfirmation;
