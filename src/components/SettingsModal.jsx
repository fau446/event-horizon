import { useState } from "react";
import styles from "../styles/EventModal.module.css";

function SettingsModal({
  setDisplaySettingsModal,
  allTimeZones,
  userTimezone,
  setUserTimezone,
}) {
  const APIURL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({ timezone: userTimezone });
  const [disableButtons, setDisableButtons] = useState(false);

  function handleInputChange(e) {
    if (e.target.name === "timezone") {
      setFormData({ ...formData, timezone: e.target.value });
    }
  }

  function updateTimezone() {}

  async function handleFormSubmit(e) {
    e.preventDefault();

    setDisableButtons(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${APIURL}/timezone/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setUserTimezone(formData.timezone);
        setDisplaySettingsModal(false);
      }
    } catch (err) {
      setDisableButtons(false);
      console.log(err);
    }
  }

  return (
    <>
      <div className={styles.modal}>
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <div className={styles.top}>
            <h2>Settings</h2>
            <p
              className={styles.close}
              onClick={() => setDisplaySettingsModal(false)}
            >
              X
            </p>
          </div>
          <div className={styles.field}>
            <label htmlFor="timezone">Time Zone:</label>
            <select
              name="timezone"
              id="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
            >
              {allTimeZones.map((timezone) => (
                <option value={timezone} key={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => setDisplaySettingsModal(false)}
            >
              Cancel
            </button>
            <button className={styles.confirm} disabled={disableButtons}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <div
        className={styles.overlay}
        onClick={() => setDisplaySettingsModal(false)}
      ></div>
    </>
  );
}

export default SettingsModal;
