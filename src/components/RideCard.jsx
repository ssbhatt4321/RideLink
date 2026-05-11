function RideCard({ ride, onViewDetails }) {
    const isFull = ride.seatsAvailable === 0 || ride.status === "Full";
  
    return (
      <div className="card ride-card">
        <div className="card-top-row">
          <span className={`status-badge ${isFull ? "full" : "available"}`}>
            {isFull ? "Full" : "Available"}
          </span>
          <span className="price-pill">{ride.price}</span>
        </div>
  
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
          <strong>Seats:</strong> {ride.seatsAvailable} / {ride.seatsTotal}
        </p>
  
        <button className="primary-btn" onClick={() => onViewDetails(ride)}>
          View Details
        </button>
      </div>
    );
  }
  
  export default RideCard;