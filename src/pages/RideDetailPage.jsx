import { useState } from "react";
import Navbar from "../components/Navbar";

function RideDetailPage({ selectedRide, setCurrentPage }) {
  const [requested, setRequested] = useState(false);

  if (!selectedRide) {
    return (
      <>
        <Navbar setCurrentPage={setCurrentPage} />
        <div className="page-container">
          <div className="card">
            <h2>No ride selected</h2>
            <button className="primary-btn" onClick={() => setCurrentPage("feed")}>
              Back to Ride Feed
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleRequestSeat = () => {
    setRequested(true);
  };

  return (
    <>
      <Navbar setCurrentPage={setCurrentPage} />

      <div className="page-container">
        <div className="card detail-card">
          <h2>
            {selectedRide.origin} → {selectedRide.destination}
          </h2>

          <p>
            <strong>Driver:</strong> {selectedRide.driverName}
          </p>
          <p>
            <strong>College:</strong> {selectedRide.driverCollege}
          </p>
          <p>
            <strong>Departure Date:</strong> {selectedRide.departureDate}
          </p>
          <p>
            <strong>Departure Time:</strong> {selectedRide.departureTime}
          </p>
          <p>
            <strong>Seats Available:</strong> {selectedRide.seatsAvailable}
          </p>
          <p>
            <strong>Price:</strong> {selectedRide.price}
          </p>
          <p>
            <strong>Notes:</strong> {selectedRide.notes}
          </p>

          {requested && (
            <div className="success-banner">
              Seat request submitted successfully.
            </div>
          )}

          <button
            className="primary-btn"
            onClick={handleRequestSeat}
            disabled={requested || selectedRide.seatsAvailable === 0}
          >
            {requested ? "Request Pending" : "Request Seat"}
          </button>
        </div>
      </div>
    </>
  );
}

export default RideDetailPage;