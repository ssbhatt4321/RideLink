import { useState } from "react";
import Navbar from "../components/Navbar";

function RideFeedPage({ rides, setCurrentPage, setSelectedRide }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRides = rides.filter((ride) => {
    const combinedText = `${ride.origin} ${ride.destination} ${ride.driverName}`.toLowerCase();
    return combinedText.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <Navbar setCurrentPage={setCurrentPage} />

      <div className="page-container">
        <div className="feed-header">
          <h2>Available Rides</h2>
          <p>Browse and filter rides across the Five College community.</p>
        </div>

        <div className="search-bar card">
          <input
            type="text"
            placeholder="Search by origin, destination, or driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ride-grid">
          {filteredRides.map((ride) => (
            <div key={ride.id} className="card ride-card">
              <h3>
                {ride.origin} → {ride.destination}
              </h3>
              <p>
                <strong>Date:</strong> {ride.departureDate}
              </p>
              <p>
                <strong>Time:</strong> {ride.departureTime}
              </p>
              <p>
                <strong>Driver:</strong> {ride.driverName}
              </p>
              <p>
                <strong>Seats Available:</strong> {ride.seatsAvailable}
              </p>
              <p>
                <strong>Price:</strong> {ride.price}
              </p>

              <button
                className="primary-btn"
                onClick={() => {
                  setSelectedRide(ride);
                  setCurrentPage("detail");
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RideFeedPage;