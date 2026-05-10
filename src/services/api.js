import { mockRides, mockRequests } from "../data/mockData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const useBackend = () => import.meta.env.VITE_USE_BACKEND === "true";

// Demo user IDs from the seed.sql file.
// Shashank = driver, Akshat = passenger.
const DEMO_DRIVER_ID = "a1000000-0000-0000-0000-000000000001";
const DEMO_PASSENGER_ID = "a1000000-0000-0000-0000-000000000002";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

function formatDateTime(departure) {
  const date = new Date(departure);

  if (Number.isNaN(date.getTime())) {
    return {
      departureDate: "",
      departureTime: "",
    };
  }

  return {
    departureDate: date.toISOString().slice(0, 10),
    departureTime: date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function normalizeRide(dbRide) {
  const { departureDate, departureTime } = formatDateTime(dbRide.departure);

  const seatsAvailable = dbRide.available_seats ?? dbRide.seatsAvailable ?? 0;
  const seatsTotal = dbRide.total_seats ?? dbRide.seatsTotal ?? seatsAvailable;

  return {
    id: dbRide.id,
    driverId: dbRide.driver_id,
    driverName: dbRide.driver_name || "Driver",
    driverCollege: dbRide.driver_college || "",
    origin: dbRide.origin,
    destination: dbRide.destination,
    departureDate,
    departureTime,
    seatsTotal,
    seatsAvailable,
    price: dbRide.price || "$10",
    notes: dbRide.notes || "No additional notes.",
    status:
      seatsAvailable === 0
        ? "Full"
        : dbRide.status === "active"
          ? "Available"
          : dbRide.status || "Available",
  };
}

function normalizeRequest(dbRequest) {
  return {
    id: dbRequest.id,
    rideId: dbRequest.ride_id,
    passengerName: dbRequest.passenger_name || "Akshat Shrivastava",
    passengerCollege: dbRequest.college || dbRequest.passengerCollege || "UMass Amherst",
    seatsRequested: dbRequest.seatsRequested || 1,
    requestedAt: dbRequest.requested_at || dbRequest.requestedAt || new Date().toLocaleString(),
    status:
      dbRequest.status?.charAt(0).toUpperCase() + dbRequest.status?.slice(1) ||
      "Pending",
  };
}

export async function getRides() {
  if (!useBackend()) {
    await delay();
    return mockRides;
  }

  const rides = await request("/rides");
  return rides.map(normalizeRide);
}

export async function createRide(rideData) {
  if (!useBackend()) {
    await delay();

    return {
      id: Date.now(),
      driverId: 1,
      driverName: "Akshat Shrivastava",
      driverCollege: "UMass Amherst",
      seatsTotal: Number(rideData.seatsAvailable),
      seatsAvailable: Number(rideData.seatsAvailable),
      price: rideData.price || "$10",
      status: "Available",
      ...rideData,
    };
  }

  const departure = `${rideData.departureDate}T${rideData.departureTime}`;

  const newRide = await request("/rides", {
    method: "POST",
    body: JSON.stringify({
      driverId: DEMO_DRIVER_ID,
      origin: rideData.origin,
      destination: rideData.destination,
      departure,
      totalSeats: Number(rideData.seatsAvailable),
      notes: rideData.notes || null,
    }),
  });

  return normalizeRide(newRide);
}

export async function requestSeat(rideId) {
  if (!useBackend()) {
    await delay();

    return {
      id: Date.now(),
      rideId,
      passengerName: "Akshat Shrivastava",
      passengerCollege: "UMass Amherst",
      seatsRequested: 1,
      requestedAt: new Date().toLocaleString(),
      status: "Pending",
    };
  }

  const newRequest = await request("/requests", {
    method: "POST",
    body: JSON.stringify({
      rideId,
      passengerId: DEMO_PASSENGER_ID,
    }),
  });

  return normalizeRequest(newRequest);
}

export async function getDriverRequests() {
  if (!useBackend()) {
    await delay();
    return mockRequests;
  }

  const driverRides = await request(`/drivers/${DEMO_DRIVER_ID}/rides`);

  const requestLists = await Promise.all(
    driverRides.map((ride) => request(`/rides/${ride.id}/requests`))
  );

  return requestLists.flat().map(normalizeRequest);
}

export async function updateRequestStatus(requestId, status) {
  if (!useBackend()) {
    await delay();

    return {
      requestId,
      status,
      updatedAt: new Date().toLocaleString(),
    };
  }

  const endpoint =
    status === "Approved"
      ? `/requests/${requestId}/approve`
      : `/requests/${requestId}/reject`;

  const updatedRequest = await request(endpoint, {
    method: "PATCH",
  });

  return normalizeRequest(updatedRequest);
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}