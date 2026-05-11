import { useMemo } from "react";
import Navbar from "../components/Navbar";
import RequestCard from "../components/RequestCard";
import { updateRequestStatus } from "../services/api";

function DriverDashboardPage({
  currentPage,
  rides,
  requests,
  setSeatRequests,
  setCurrentPage,
  onApproveRequest,
}) {
  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === "Pending").length,
    [requests]
  );

  const handleUpdateStatus = async (requestId, status) => {
    await updateRequestStatus(requestId, status);

    const requestToUpdate = requests.find((request) => request.id === requestId);

    setSeatRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    );

    if (status === "Approved" && requestToUpdate) {
      onApproveRequest(requestToUpdate.rideId);
    }
  };

  const findRideById = (rideId) => rides.find((ride) => ride.id === rideId);

  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="page-container">
        <section className="page-header">
          <div>
            <p className="eyebrow">Driver dashboard</p>
            <h1>Manage Ride Requests</h1>
            <p>Review pending passenger requests and approve or reject them.</p>
          </div>

          <div className="metric-card">
            <span>{pendingCount}</span>
            <p>Pending requests</p>
          </div>
        </section>

        <section className="dashboard-grid">
          <div>
            <h2>Incoming Seat Requests</h2>

            <div className="request-list">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    ride={findRideById(request.rideId)}
                    onApprove={(requestId) =>
                      handleUpdateStatus(requestId, "Approved")
                    }
                    onReject={(requestId) =>
                      handleUpdateStatus(requestId, "Rejected")
                    }
                  />
                ))
              ) : (
                <div className="card empty-state">
                  <h3>No requests yet</h3>
                  <p>New passenger requests will appear here.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2>My Posted Rides</h2>

            <div className="request-list">
              {rides.slice(0, 3).map((ride) => (
                <div key={ride.id} className="card compact-ride">
                  <span className={`status-badge ${ride.status.toLowerCase()}`}>
                    {ride.status}
                  </span>
                  <h3>
                    {ride.origin} → {ride.destination}
                  </h3>
                  <p>
                    {ride.departureDate} at {ride.departureTime}
                  </p>
                  <p>
                    Seats: {ride.seatsAvailable} / {ride.seatsTotal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default DriverDashboardPage;