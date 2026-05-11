import { useEffect, useState } from "react";
import { getRides, requestSeat, createRide, getDriverRequests } from "./services/api";
import LoginPage from "./pages/LoginPage";
import RideFeedPage from "./pages/RideFeedPage";
import RideDetailPage from "./pages/RideDetailPage";
import CreateRidePage from "./pages/CreateRidePage";
import DriverDashboardPage from "./pages/DriverDashboardPage";
import "./styles.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [seatRequests, setSeatRequests] = useState([]);

  useEffect(() => {
    async function loadInitialData() {
      const loadedRides = await getRides();
      const loadedRequests = await getDriverRequests();
  
      setRides(loadedRides);
      setSeatRequests(loadedRequests);
    }
  
    loadInitialData();
  }, []);

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setCurrentPage("detail");
  };

  const handleCreateRide = async (rideData) => {
    const newRide = await createRide(rideData);
    setRides((prevRides) => [newRide, ...prevRides]);
    return newRide;
  };

  const handleRequestSeat = async (rideId) => {
    try {
      const newRequest = await requestSeat(rideId);
      setSeatRequests((prevRequests) => [newRequest, ...prevRequests]);
      return newRequest;
    } catch (error) {
      throw error;
    }
  };

  const handleApproveRequest = (rideId) => {
    setRides((prevRides) =>
      prevRides.map((ride) => {
        if (ride.id !== rideId) return ride;

        const updatedSeats = Math.max(ride.seatsAvailable - 1, 0);

        return {
          ...ride,
          seatsAvailable: updatedSeats,
          status: updatedSeats === 0 ? "Full" : "Available",
        };
      })
    );
  };

  return (
    <>
      {currentPage === "login" && <LoginPage setCurrentPage={setCurrentPage} />}

      {currentPage === "feed" && (
        <RideFeedPage
          currentPage={currentPage}
          rides={rides}
          setCurrentPage={setCurrentPage}
          onViewDetails={handleViewDetails}
        />
      )}

      {currentPage === "detail" && (
        <RideDetailPage
          currentPage={currentPage}
          selectedRide={selectedRide}
          setCurrentPage={setCurrentPage}
          onRequestSeat={handleRequestSeat}
        />
      )}

      {currentPage === "create" && (
        <CreateRidePage
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onCreateRide={handleCreateRide}
        />
      )}

      {currentPage === "dashboard" && (
        <DriverDashboardPage
          currentPage={currentPage}
          rides={rides}
          requests={seatRequests}
          setSeatRequests={setSeatRequests}
          setCurrentPage={setCurrentPage}
          onApproveRequest={handleApproveRequest}
        />
      )}
    </>
  );
}

export default App;