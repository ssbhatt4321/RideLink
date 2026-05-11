import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import App from "../App";

const testRides = [
  {
    id: 101,
    driverId: 2,
    driverName: "Shashank Bhatt",
    driverCollege: "UMass Amherst",
    origin: "UMass Amherst",
    destination: "Boston Logan Airport",
    departureDate: "2026-05-08",
    departureTime: "09:00 AM",
    seatsTotal: 3,
    seatsAvailable: 2,
    price: "$18",
    notes: "Leaving from Haigis Mall. Please be on time.",
    status: "Available",
  },
  {
    id: 103,
    driverId: 4,
    driverName: "Maya Patel",
    driverCollege: "Smith College",
    origin: "Smith College",
    destination: "Bradley Airport",
    departureDate: "2026-05-09",
    departureTime: "07:15 AM",
    seatsTotal: 2,
    seatsAvailable: 1,
    price: "$20",
    notes: "Small luggage only.",
    status: "Available",
  },
];

vi.mock("../services/api", () => ({
  getRides: vi.fn(async () => testRides),
  getDriverRequests: vi.fn(async () => []),
  requestSeat: vi.fn(async (rideId) => ({
    id: 999,
    rideId,
    passengerName: "Akshat Shrivastava",
    passengerCollege: "UMass Amherst",
    seatsRequested: 1,
    requestedAt: "2026-05-08 10:00 AM",
    status: "Pending",
  })),
  createRide: vi.fn(async (rideData) => ({
    id: 1000,
    driverId: 1,
    driverName: "Akshat Shrivastava",
    driverCollege: "UMass Amherst",
    seatsTotal: Number(rideData.seatsAvailable),
    seatsAvailable: Number(rideData.seatsAvailable),
    price: rideData.price || "$10",
    status: "Available",
    ...rideData,
  })),
  updateRequestStatus: vi.fn(async (requestId, status) => ({
    requestId,
    status,
    updatedAt: "2026-05-08 10:05 AM",
  })),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RideLink frontend prototype", () => {
  test("renders the login page on initial load", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /RideLink/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  test("logs in with mock authentication and shows ride feed", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/Email/i), "akshat@umass.edu");
    await user.type(screen.getByLabelText(/Password/i), "password123");
    await user.click(screen.getByRole("button", { name: /Log In/i }));

    expect(await screen.findByRole("heading", { name: /Available Rides/i })).toBeInTheDocument();
    expect(await screen.findByText(/UMass Amherst → Boston Logan Airport/i)).toBeInTheDocument();
  });

  test("filters rides using search input", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/Email/i), "akshat@umass.edu");
    await user.type(screen.getByLabelText(/Password/i), "password123");
    await user.click(screen.getByRole("button", { name: /Log In/i }));

    const searchInput = await screen.findByLabelText(/Search rides/i);
    await user.type(searchInput, "Bradley");

    expect(await screen.findByText(/Smith College → Bradley Airport/i)).toBeInTheDocument();
    expect(screen.queryByText(/UMass Amherst → Boston Logan Airport/i)).not.toBeInTheDocument();
  });

  test("submits a seat request from ride detail page", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/Email/i), "akshat@umass.edu");
    await user.type(screen.getByLabelText(/Password/i), "password123");
    await user.click(screen.getByRole("button", { name: /Log In/i }));

    const detailsButtons = await screen.findAllByRole("button", { name: /View Details/i });
    await user.click(detailsButtons[0]);

    expect(
      await screen.findByRole("heading", { name: /UMass Amherst → Boston Logan Airport/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Request Seat/i }));

    expect(
      await screen.findByText(/Seat request submitted successfully/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Request Pending/i })).toBeDisabled();
  });

  test("creates a new ride from the post ride page", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/Email/i), "akshat@umass.edu");
    await user.type(screen.getByLabelText(/Password/i), "password123");
    await user.click(screen.getByRole("button", { name: /Log In/i }));

    await user.click(await screen.findByRole("button", { name: /Post a Ride/i }));

    await user.type(screen.getByLabelText(/Origin/i), "UMass Amherst");
    await user.type(screen.getByLabelText(/Destination/i), "Northampton");
    await user.type(screen.getByLabelText(/Date/i), "2026-05-10");
    await user.type(screen.getByLabelText(/Time/i), "14:30");
    await user.type(screen.getByLabelText(/Seats Available/i), "2");
    await user.type(screen.getByLabelText(/Cost Share/i), "$8");
    await user.type(screen.getByLabelText(/Notes/i), "Pickup near campus center.");

    const postRideButtons = screen.getAllByRole("button", { name: /^Post Ride$/i });
    await user.click(postRideButtons[postRideButtons.length - 1]);

    expect(await screen.findByText(/Ride posted successfully/i)).toBeInTheDocument();
  });
});