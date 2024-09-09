import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/EventModal.module.css";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  ControlPosition,
  MapControl,
} from "@vis.gl/react-google-maps";
import PlaceAutocomplete from "./PlaceAutocomplete";
import MapHandler from "./MapHandler";
import { formatAddress } from "../utils/HelperFunctions";

function EventCreationModal({
  categories,
  fetchEvents,
  setDisplayEventModal,
  setFeedbackMessage,
  setError,
}) {
  const navigate = useNavigate();
  const APIURL = import.meta.env.VITE_API_URL;
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const googleMapsMapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

  const [formData, setFormData] = useState({
    title: "",
    start_time: "",
    end_time: "",
    categoryName: "",
    categoryColor: "blue",
    body: "",
    status: "incomplete",
    location: "",
  });
  const [displayNewCategoryField, setDisplayNewCategoryField] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [markerCoords, setMarkerCoords] = useState({
    lat: 49.283272,
    lng: -123.119057,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);

  function handleInputChange(e) {
    if (e.target.name === "category") {
      setDisplayNewCategoryField(false);
      setFormData({ ...formData, categoryName: e.target.value });
      setNewCategoryName("");
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  }

  function handleNewCategoryChange(e) {
    setNewCategoryName(e.target.value);
    setFormData({ ...formData, categoryName: e.target.value });
  }

  function handleColorDropdownChange(color) {
    setFormData({ ...formData, categoryColor: color });
    setDropdownOpen(!dropdownOpen);
  }

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const requiredFields = [
      "title",
      "start_time",
      "end_time",
      "categoryName",
      "body",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      setError(true);
      setFeedbackMessage(
        `Please fill in the missing fields: ${emptyFields.join(", ")}`
      );
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${APIURL}/events/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchEvents();
        setDisplayEventModal(false);
        setError(false);
        setFeedbackMessage("Event successfully created!");
      }
    } catch (err) {
      setError(true);
      setFeedbackMessage("Error, server is down.");
    }
  }

  useEffect(() => {
    async function getCoords() {
      // return if selectedPlace is null
      if (selectedPlace === null || selectedPlace === undefined) return;

      let formattedAddress = "";
      let address = "";
      if (
        typeof selectedPlace === "object" &&
        selectedPlace.formatted_address
      ) {
        formattedAddress = selectedPlace.formatted_address;
        address = formatAddress(selectedPlace.formatted_address);
      } else {
        formattedAddress = selectedPlace;
        address = formatAddress(selectedPlace);
      }

      // Call the Geocoding api to get the coordinates to place the marker
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`
        );

        if (response.ok) {
          const jsonData = await response.json();
          setMarkerCoords(jsonData.results[0].geometry.location);
        }
      } catch (err) {
        setError(true);
        setFeedbackMessage("Error");
      }

      setFormData({
        ...formData,
        ["location"]: formattedAddress,
      });
    }
    getCoords();
  }, [selectedPlace]);

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.content}>
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={styles.top}>
              <h2>Add Event</h2>
              <p
                className={styles.close}
                onClick={() => setDisplayEventModal(false)}
              >
                X
              </p>
            </div>
            <div className={styles.field}>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.times}>
              <div className={styles.time}>
                <label htmlFor="start_time">Start Time:</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  id="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.time}>
                <label htmlFor="end_time">End Time:</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  id="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.categorySection}>
              <label htmlFor="category">Category:</label>
              <div className={styles.categories}>
                {categories.map((category) => (
                  <div
                    className={styles.categoryItem}
                    key={category.category_id}
                  >
                    <input
                      type="radio"
                      name="category"
                      id={category.category_id}
                      value={category.name}
                      checked={formData.categoryName === category.name}
                      onChange={handleInputChange}
                    />
                    <label htmlFor={category.category_id}>
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
              {displayNewCategoryField ? (
                <div className={styles.field}>
                  <label htmlFor="newCategory">New Category:</label>
                  <div className={styles.newCategory}>
                    <input
                      type="text"
                      name="newCategory"
                      id="newCategory"
                      value={newCategoryName}
                      onChange={handleNewCategoryChange}
                    />
                    <div className={styles.colorDropdownWrapper}>
                      <div
                        className={styles.colorDropdown}
                        onClick={toggleDropdown}
                      >
                        <img
                          src={`../../colors/${formData.categoryColor}.png`}
                          alt="Selected Color"
                          className={styles.selectedColor}
                        />
                      </div>
                      {dropdownOpen && (
                        <ul className={styles.dropdownList}>
                          {[
                            "blue",
                            "green",
                            "red",
                            "purple",
                            "orange",
                            "black",
                          ].map((color) => (
                            <li
                              key={color}
                              onClick={() => handleColorDropdownChange(color)}
                            >
                              <img
                                src={`../../colors/${color}.png`}
                                alt={color}
                                width="25"
                                height="25"
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setDisplayNewCategoryField(true)}
                  >
                    Add new category
                  </button>
                </div>
              )}
            </div>

            <div className={styles.location}>
              <APIProvider apiKey={googleMapsApiKey}>
                <div style={{ height: "400px", width: "100%", zIndex: "1" }}>
                  <Map
                    defaultZoom={9}
                    defaultCenter={markerCoords}
                    mapId={googleMapsMapId}
                  />
                  <AdvancedMarker position={markerCoords} />
                  <MapControl position={ControlPosition.TOP}>
                    <PlaceAutocomplete
                      onPlaceSelect={setSelectedPlace}
                      savedLocation=""
                    />
                  </MapControl>
                  <MapHandler place={selectedPlace} />
                </div>
              </APIProvider>
            </div>

            <div className={styles.field}>
              <label htmlFor="body">Description:</label>
              <textarea
                name="body"
                id="body"
                cols="30"
                rows="10"
                value={formData.body}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.buttons}>
              <button type="button" onClick={() => setDisplayEventModal(false)}>
                Cancel
              </button>
              <button className={styles.confirm}>Add Event</button>
            </div>
          </form>
        </div>
      </div>
      <div
        className={styles.overlay}
        onClick={() => setDisplayEventModal(false)}
      ></div>
    </>
  );
}

export default EventCreationModal;
