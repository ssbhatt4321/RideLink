import { mockRides, mockRequests } from "../data/mockData";

/**
 * Frontend service layer for RideLink.
 *
 * For the final prototype, these functions use mock data so the frontend can
 * demonstrate the main workflows without depending on an unfinished backend.
 *
 * When the Express backend is ready, the internals of these functions can be
 * replaced with fetch() calls to the real REST API endpoints.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getRides() {
  await delay();
  return mockRides;
}

export async function createRide(rideData) {
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

export async function requestSeat(rideId, passengerName = "Akshat Shrivastava") {
  await delay();

  return {
    id: Date.now(),
    rideId,
    passengerName,
    passengerCollege: "UMass Amherst",
    seatsRequested: 1,
    requestedAt: new Date().toLocaleString(),
    status: "Pending",
  };
}

export async function getDriverRequests() {
  await delay();
  return mockRequests;
}

export async function updateRequestStatus(requestId, status) {
  await delay();

  return {
    requestId,
    status,
    updatedAt: new Date().toLocaleString(),
  };
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}