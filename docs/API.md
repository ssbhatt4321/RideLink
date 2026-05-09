# RideLink API Documentation

This document describes the REST API for RideLink. The API supports authentication, ride management, seat requests, messaging, ratings, and reports.

Base URL for local development:

```text
http://localhost:4000/api

Responses are returned in JSON format.

1. Health Check
GET /health

Checks whether the backend server is running.

Example Response
{
  "status": "ok"
}

2. Authentication
POST /auth/register

Creates a new user account.

Request Body
{
  "name": "Driver Test",
  "email": "driver@example.com",
  "college": "UMass Amherst",
  "password": "Password123"
}
Success Response
{
  "id": "user-uuid",
  "name": "Driver Test",
  "email": "driver@example.com",
  "college": "UMass Amherst",
  "rating_avg": 0,
  "created_at": "2026-05-07T20:49:01.849Z"
}
Possible Errors:
Missing required fields
Email already exists
Database error

POST /auth/login

Authenticates an existing user.

Request Body
{
  "email": "driver@example.com",
  "password": "Password123"
}
Success Response
{
  "id": "user-uuid",
  "name": "Driver Test",
  "email": "driver@example.com",
  "college": "UMass Amherst",
  "rating_avg": 0
}
Possible Errors:
Invalid email
Invalid password
User not found

3. Rides
GET /rides

Retrieves available rides. Optional query parameters can be used to filter results.

Query Parameters
| Parameter     | Description                |
| ------------- | -------------------------- |
| `origin`      | Filter by ride origin      |
| `destination` | Filter by ride destination |
| `departure`   | Filter by departure date   |

Example Request
GET /api/rides?origin=UMass%20Amherst&destination=Boston%20Logan&departure=2026-06-01
Success Response
[
  {
    "id": "ride-uuid",
    "driver_id": "driver-uuid",
    "origin": "UMass Amherst",
    "destination": "Boston Logan Airport",
    "departure": "2026-06-01T14:00:00.000Z",
    "total_seats": 2,
    "available_seats": 1,
    "notes": "Test ride",
    "status": "active",
    "created_at": "2026-05-07T20:49:01.909Z",
    "driver_name": "Driver Test",
    "driver_rating": 0
  }
]
GET /rides/:id

Retrieves details for a specific ride.

Example Request
GET /api/rides/088f40f9-5355-42b3-a8b8-206279adea19
Success Response
{
  "id": "ride-uuid",
  "driver_id": "driver-uuid",
  "origin": "Test Origin",
  "destination": "Test Destination",
  "departure": "2026-06-01T14:00:00.000Z",
  "total_seats": 2,
  "available_seats": 1,
  "notes": "Test ride",
  "status": "active",
  "created_at": "2026-05-07T20:49:01.909Z",
  "driver_name": "Driver Test",
  "driver_rating": 0,
  "driver_college": "Test College"
}
Possible Errors:
Ride not found
Invalid ride ID
Database error

POST /rides

Creates a new ride posting.

Request Body
{
  "driverId": "driver-uuid",
  "origin": "Test Origin",
  "destination": "Test Destination",
  "departure": "2026-06-01T10:00:00Z",
  "totalSeats": 2,
  "notes": "Test ride"
}
Success Response
{
  "id": "ride-uuid",
  "driver_id": "driver-uuid",
  "origin": "Test Origin",
  "destination": "Test Destination",
  "departure": "2026-06-01T14:00:00.000Z",
  "total_seats": 2,
  "available_seats": 2,
  "notes": "Test ride",
  "status": "active",
  "created_at": "2026-05-07T20:49:01.909Z"
}
Possible Errors:
Missing required ride fields
Invalid driver ID
Invalid seat count
Database error

4. Seat Requests
POST /requests

Creates a seat request for a ride.

Request Body
{
  "rideId": "ride-uuid",
  "passengerId": "passenger-uuid"
}
Success Response
{
  "id": "request-uuid",
  "ride_id": "ride-uuid",
  "passenger_id": "passenger-uuid",
  "status": "pending",
  "requested_at": "2026-05-07T20:49:01.917Z"
}
Possible Errors:
Ride not found
Passenger not found
Ride is full
Duplicate request
Database error

PATCH /requests/:id/approve

Approves a seat request.

When a request is approved, the backend updates the request status and decreases the ride’s available seat count.

Example Request
PATCH /api/requests/e1d9ed09-497a-42df-95dd-3461d1a225de/approve
Success Response
{
  "id": "request-uuid",
  "ride_id": "ride-uuid",
  "passenger_id": "passenger-uuid",
  "status": "approved",
  "requested_at": "2026-05-07T20:49:01.917Z"
}
Expected Side Effect

Before approval:

{
  "available_seats": 2
}

After approval:

{
  "available_seats": 1
}
Possible Errors:
Request not found
Ride is already full
Request already approved/rejected
Database transaction error

PATCH /requests/:id/reject

Rejects a seat request.

Example Request
PATCH /api/requests/e1d9ed09-497a-42df-95dd-3461d1a225de/reject
Success Response
{
  "id": "request-uuid",
  "ride_id": "ride-uuid",
  "passenger_id": "passenger-uuid",
  "status": "rejected",
  "requested_at": "2026-05-07T20:49:01.917Z"
}
Possible Errors:
Request not found
Request already approved/rejected
Database error

GET /rides/:rideId/requests

Retrieves all requests for a specific ride.

Example Request
GET /api/rides/ride-uuid/requests
Success Response
[
  {
    "id": "request-uuid",
    "ride_id": "ride-uuid",
    "passenger_id": "passenger-uuid",
    "status": "pending",
    "requested_at": "2026-05-07T20:49:01.917Z",
    "passenger_name": "Passenger Test"
  }
]
GET /drivers/:driverId/rides

Retrieves all rides created by a specific driver.

Example Request
GET /api/drivers/driver-uuid/rides
Success Response
[
  {
    "id": "ride-uuid",
    "driver_id": "driver-uuid",
    "origin": "Test Origin",
    "destination": "Test Destination",
    "departure": "2026-06-01T14:00:00.000Z",
    "total_seats": 2,
    "available_seats": 1,
    "notes": "Test ride",
    "status": "active"
  }
]

5. Messages
POST /messages

Creates a message for an approved ride request.

Request Body
{
  "requestId": "request-uuid",
  "senderId": "driver-uuid",
  "content": "Hello passenger"
}
Success Response
{
  "id": "message-uuid",
  "request_id": "request-uuid",
  "sender_id": "driver-uuid",
  "content": "Hello passenger",
  "sent_at": "2026-05-07T20:49:01.923Z"
}
Possible Errors:
Missing content
Request not found
Sender not part of request
Database error

GET /requests/:requestId/messages

Retrieves messages for a specific seat request.

Example Request
GET /api/requests/request-uuid/messages
Success Response
[
  {
    "id": "message-uuid",
    "request_id": "request-uuid",
    "sender_id": "driver-uuid",
    "content": "Hello passenger",
    "sent_at": "2026-05-07T20:49:01.923Z",
    "sender_name": "Driver Test"
  }
]

6. Ratings
POST /ratings

Submits a rating after a ride.

Request Body
{
  "raterId": "passenger-uuid",
  "rateeId": "driver-uuid",
  "rideId": "ride-uuid",
  "score": 5,
  "comment": "Great driver"
}
Success Response
{
  "message": "Rating submitted"
}
Possible Errors
Invalid score
Missing rater/ratee
Ride not found
Database error

7. Reports
POST /reports

Creates a report for safety or misuse concerns.

Request Body
{
  "reporterId": "passenger-uuid",
  "reportedUserId": "driver-uuid",
  "reportedRideId": "ride-uuid",
  "reason": "Test report",
  "details": "Route test"
}
Success Response
{
  "id": "report-uuid",
  "reporter_id": "passenger-uuid",
  "reported_user_id": "driver-uuid",
  "reported_ride_id": "ride-uuid",
  "reason": "Test report",
  "details": "Route test",
  "created_at": "2026-05-07T20:49:01.928Z"
}
Note:

During endpoint testing, the reports endpoint returned reported_user_id, reported_ride_id, and details as null when the request body used mismatched field names such as reportedId and description. The expected fields should be verified against the backend route implementation.

Possible Errors:
Missing reporter
Missing reason
Invalid reported user or ride
Database error

8. Frontend Service Mapping

The frontend service layer is implemented in:

src/services/api.js

It maps frontend workflows to backend endpoints as follows:

| Frontend Function       | Backend Endpoint                                                         |
| ----------------------- | ------------------------------------------------------------------------ |
| `getRides()`            | `GET /api/rides`                                                         |
| `createRide()`          | `POST /api/rides`                                                        |
| `requestSeat()`         | `POST /api/requests`                                                     |
| `getDriverRequests()`   | `GET /api/drivers/:driverId/rides` and `GET /api/rides/:rideId/requests` |
| `updateRequestStatus()` | `PATCH /api/requests/:id/approve` or `PATCH /api/requests/:id/reject`    |

The frontend can run in two modes:

VITE_USE_BACKEND=false

Uses mock data for a stable demo.

VITE_USE_BACKEND=true

Connects the frontend service layer to the Express backend API.

9. Endpoint Testing Summary

Backend endpoint testing was performed using a Node script that exercised the major API workflows:

Health check
User registration
Ride creation
Ride search
Ride detail retrieval
Seat request creation
Seat request approval
Available seat count update after approval
Message creation
Message retrieval
Rating submission
Report submission

The test confirmed that approving a seat request successfully reduced the ride’s available seats from 2 to 1.

10. Known Limitations
- Frontend authentication currently uses mock mode for demo stability.
- Some frontend-backend integration depends on a working local PostgreSQL setup.
- Backend report field names should be verified because mismatched request body fields can result in null values.
- Full deployed integration has not yet been completed.