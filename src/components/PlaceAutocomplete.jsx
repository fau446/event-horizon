import { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

function PlaceAutocomplete({ onPlaceSelect, savedLocation }) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  // only runs on initial render
  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    // input will now start with the savedLocation value
    inputRef.current.value = savedLocation;

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));

    // If there's a saved location, fetch location info
    if (savedLocation !== "") {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: savedLocation }, (results, status) => {
        if (status === "OK" && results[0]) {
          const place = results[0];
          onPlaceSelect(place);
        } else {
          console.log("Geocode error: " + status);
        }
      });
    }
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      const selectedPlace = placeAutocomplete.getPlace();
      onPlaceSelect(selectedPlace);
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input ref={inputRef} />
    </div>
  );
}

export default PlaceAutocomplete;
