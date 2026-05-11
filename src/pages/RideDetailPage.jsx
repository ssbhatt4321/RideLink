import { useState } from "react";
import Navbar from "../components/Navbar";

function RideDetailPage({ currentPage, selectedRide, setCurrentPage, onRequestSeat }) {
  const [requestStatus, setRequestStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!selectedRide) {
    return (
      <>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="page-container">
          <div className="card empty-state">
            <h2>No ride selected</h2>
            <p>Please return to the ride feed and choose a ride.</p>
            <button className="primary-btn" onClick={() => setCurrentPage("feed")}>
              Back to Ride Feed
            </button>
          </div>
        </main>
      </>
    );
  }

  const handleRequestSeat = async () => {
    setRequestStatus("loading");
    setErrorMessage("");
    try {
      await onRequestSeat(selectedRide.id);
      setRequestStatus("submitted");
    } catch (error) {
      setRequestStatus("idle");
      setErrorMessage(error.message || "Failed to submit seat request. Please try again.");
    }
  };

  const isFull = selectedRide.seatsAvailable === 0 || selectedRide.status === "Full";
  const requestSubmitted = requestStatus === "submitted";

  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="page-container">
        <button className="link-btn" onClick={() => setCurrentPage("feed")}>
          ← Back to Ride Feed
        </button>

        <section className="card detail-card">
          <div className="card-top-row">
            <span className={`status-badge ${isFull ? "full" : "available"}`}>
              {isFull ? "Full" : "Available"}
            </span>
            <span className="price-pill">{selectedRide.price}</span>
          </div>

          <h1>
            {selectedRide.origin} → {selectedRide.destination}
          </h1>

          <div className="detail-grid">
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
              <strong>Total Seats:</strong> {selectedRide.seatsTotal}
            </p>
          </div>

          <div className="notes-box">
            <strong>Ride notes:</strong>
            <p>{selectedRide.notes}</p>
          </div>

          {requestSubmitted && (
            <div className="success-banner">
              Seat request submitted successfully. Status: Pending driver approval.
            </div>
          )}

          {errorMessage && (
            <div className="warning-banner">
              {errorMessage}
            </div>
          )}

          {isFull && (
            <div className="warning-banner">
              This ride is currently full, so seat requests are disabled.
            </div>
          )}

          <button
            className="primary-btn"
            onClick={handleRequestSeat}
            disabled={requestSubmitted || isFull || requestStatus === "loading"}
          >
            {requestStatus === "loading"
              ? "Submitting..."
              : requestSubmitted
                ? "Request Pending"
                : "Request Seat"}
          </button>
        </section>
      </main>
    </>
  );
}

export default RideDetailPage;