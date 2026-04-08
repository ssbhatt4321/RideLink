import { useState } from "react";
import Navbar from "../components/Navbar";

function CreateRidePage({ setCurrentPage, setRides }) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    seatsAvailable: "",
    notes: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRide = {
      id: Date.now(),
      driverName: "Akshat Shrivastava",
      driverCollege: "UMass Amherst",
      origin: formData.origin,
      destination: formData.destination,
      departureDate: formData.departureDate,
      departureTime: formData.departureTime,
      seatsAvailable: Number(formData.seatsAvailable),
      price: "$10",
      notes: formData.notes,
      status: "Available",
    };

    setRides((prev) => [newRide, ...prev]);
    setSuccess(true);

    setFormData({
      origin: "",
      destination: "",
      departureDate: "",
      departureTime: "",
      seatsAvailable: "",
      notes: "",
    });
  };

  return (
    <>
      <Navbar setCurrentPage={setCurrentPage} />

      <div className="page-container">
        <div className="card form-card">
          <h2>Post a New Ride</h2>

          {success && (
            <div className="success-banner">Ride posted successfully.</div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <label>Origin</label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              required
            />

            <label>Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />

            <label>Date</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              required
            />

            <label>Time</label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required
            />

            <label>Seats Available</label>
            <input
              type="number"
              name="seatsAvailable"
              min="1"
              value={formData.seatsAvailable}
              onChange={handleChange}
              required
            />

            <label>Notes</label>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Optional details about pickup, luggage, or cost-sharing"
            />

            <button type="submit" className="primary-btn">
              Post Ride
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateRidePage;