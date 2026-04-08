import { useState } from "react";
import { mockRides } from "./data/mockData";
import LoginPage from "./pages/LoginPage";
import RideFeedPage from "./pages/RideFeedPage";
import RideDetailPage from "./pages/RideDetailPage";
import CreateRidePage from "./pages/CreateRidePage";
import "./styles.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [rides, setRides] = useState(mockRides);
  const [selectedRide, setSelectedRide] = useState(null);

  return (
    <>
      {currentPage === "login" && <LoginPage setCurrentPage={setCurrentPage} />}

      {currentPage === "feed" && (
        <RideFeedPage
          rides={rides}
          setCurrentPage={setCurrentPage}
          setSelectedRide={setSelectedRide}
        />
      )}

      {currentPage === "detail" && (
        <RideDetailPage
          selectedRide={selectedRide}
          setCurrentPage={setCurrentPage}
        />
      )}

      {currentPage === "create" && (
        <CreateRidePage
          setCurrentPage={setCurrentPage}
          setRides={setRides}
        />
      )}
    </>
  );
}

export default App;