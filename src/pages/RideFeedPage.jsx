import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import RideCard from "../components/RideCard";
import SearchBar from "../components/SearchBar";

function RideFeedPage({ currentPage, rides, setCurrentPage, onViewDetails }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRides = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return rides.filter((ride) => {
      const combinedText = [
        ride.origin,
        ride.destination,
        ride.driverName,
        ride.driverCollege,
        ride.status,
      ]
        .join(" ")
        .toLowerCase();

      return combinedText.includes(normalizedSearch);
    });
  }, [rides, searchTerm]);

  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="page-container">
        <section className="page-header">
          <div>
            <p className="eyebrow">Ride discovery</p>
            <h1>Available Rides</h1>
            <p>
              Browse, filter, and request rides across the Five College community.
            </p>
          </div>
          <button className="primary-btn" onClick={() => setCurrentPage("create")}>
            Post a Ride
          </button>
        </section>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <section className="ride-grid">
          {filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} onViewDetails={onViewDetails} />
            ))
          ) : (
            <div className="card empty-state">
              <h3>No rides found</h3>
              <p>Try searching for a different campus, destination, or driver.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default RideFeedPage;