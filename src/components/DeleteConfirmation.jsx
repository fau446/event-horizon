function DeleteConfirmation({ deleteAction, setDisplayConfirmationWindow }) {
  return (
    <div>
      <p>Are you sure you want to delete this?</p>
      <div>
        <button
          onClick={() => setDisplayConfirmationWindow(false)}
          type="button"
        >
          Cancel
        </button>
        <button onClick={deleteAction} type="button">
          Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
