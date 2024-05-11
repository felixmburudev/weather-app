import React, { useState } from 'react';

const GeocodeForm: React.FC = () => {
  const [town, setTown] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTown(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(town)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
        setError(null);
      } else {
        throw new Error("No results found for the provided town name.");
      }
    } catch (error) {
      setError(`Error geocoding town: ${error.message}`);
      setCoordinates(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label>
          Enter the name of a town:
          <input type="text" value={town} onChange={handleInputChange} />
        </label>
        <button type="submit">Search</button>
      </form>
      {error && <p>{error}</p>}
      {coordinates && (
        <p>
          Coordinates for {town}: Latitude {coordinates.lat}, Longitude {coordinates.lon}
        </p>
      )}
    </div>
  );
};

export default GeocodeForm;
