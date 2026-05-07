import { useState } from "react";
import Navbar from "../components/Navbar";

const initialFormState = {
  origin: "",
  destination: "",
  departureDate: "",
  departureTime: "",
  seatsAvailable: "",
  price: "",
  notes: "",
};

function CreateRidePage({ currentPage, setCurrentPage, onCreateRide }) {
  const [formData, setFormData] = useState(initialFormState);
  const [success, setSuccess] = useState(false);
  const [createdRide, setCreatedRide] = useState(null);

  const handleChange = (event) => {
    setSuccess(false);
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newRide = await onCreateRide({
      ...formData,
      seatsAvailable: Number(formData.seatsAvailable),
    });

    setCreatedRide(newRide);
    setSuccess(true);
    setFormData(initialFormState);
  };

  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="page-container">
        <section className="card form-card">
          <p className="eyebrow">Driver workflow</p>
          <h1>Post a New Ride</h1>
          <p className="muted">
            Create a ride listing that passengers can discover and request.
          </p>

          {success && (
            <div className="success-banner">
              Ride posted successfully
              {createdRide ? `: ${createdRide.origin} → ${createdRide.destination}` : "."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="origin">Origin</label>
            <input
              id="origin"
              type="text"
              name="origin"
              placeholder="UMass Amherst"
              value={formData.origin}
              onChange={handleChange}
              required
            />

            <label htmlFor="destination">Destination</label>
            <input
              id="destination"
              type="text"
              name="destination"
              placeholder="Boston Logan Airport"
              value={formData.destination}
              onChange={handleChange}
              required
            />

            <div className="form-row">
              <div>
                <label htmlFor="departureDate">Date</label>
                <input
                  id="departureDate"
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="departureTime">Time</label>
                <input
                  id="departureTime"
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label htmlFor="seatsAvailable">Seats Available</label>
                <input
                  id="seatsAvailable"
                  type="number"
                  name="seatsAvailable"
                  min="1"
                  value={formData.seatsAvailable}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="price">Cost Share</label>
                <input
                  id="price"
                  type="text"
                  name="price"
                  placeholder="$10 or Free"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Pickup location, luggage limits, timing, etc."
            />

            <button type="submit" className="primary-btn">
              Post Ride
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default CreateRidePage;