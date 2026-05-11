function RequestCard({ request, ride, onApprove, onReject }) {
    return (
      <div className="card request-card">
        <div>
          <h3>{request.passengerName}</h3>
          <p className="muted">{request.passengerCollege}</p>
        </div>
  
        <p>
          <strong>Ride:</strong>{" "}
          {ride ? `${ride.origin} → ${ride.destination}` : `Ride #${request.rideId}`}
        </p>
        <p>
          <strong>Seats requested:</strong> {request.seatsRequested}
        </p>
        <p>
          <strong>Requested at:</strong> {request.requestedAt}
        </p>
  
        <span className={`status-badge ${request.status.toLowerCase()}`}>
          {request.status}
        </span>
  
        {request.status === "Pending" && (
          <div className="button-row">
            <button className="primary-btn" onClick={() => onApprove(request.id)}>
              Approve
            </button>
            <button className="secondary-btn danger" onClick={() => onReject(request.id)}>
              Reject
            </button>
          </div>
        )}
      </div>
    );
  }
  
  export default RequestCard;