# RideLink Testing Documentation

This document summarizes the testing performed for the RideLink final prototype.

## Testing Scope

The current final prototype testing focuses on the implemented frontend workflows and backend endpoint testing evidence.

The frontend supports both mock mode and backend mode through `src/services/api.js`. For stable automated frontend testing, tests run in mock mode.

## Automated Frontend Tests

Testing framework:

- Vitest
- React Testing Library
- Jest DOM matchers
- jsdom environment

## Frontend Test Cases

| Test Case ID | Feature | Description | Expected Result |
|--------------|---------|-------------|-----------------|
| FT-1 | Login | Render login page on app load | Email, password, and login button appear |
| FT-2 | Login | Submit mock login form | User is redirected to ride feed |
| FT-3 | Ride Feed | Display mock ride cards | Ride listings appear on dashboard |
| FT-4 | Ride Search | Search by route/destination | Matching rides are shown and non-matching rides are filtered out |
| FT-5 | Ride Detail | Open a ride detail page | Detailed ride information is displayed |
| FT-6 | Seat Request | Click Request Seat | Success banner appears and button changes to Request Pending |
| FT-7 | Create Ride | Submit valid ride form | Success banner appears for successful ride creation |

## How to Run Frontend Tests

Install dependencies:

```bash
npm install
```

Run tests once:
```bash
npm run test:run
```
Run tests with coverage:
```bash
npm run test:coverage
```
Manual UI Testing:

Manual UI testing was performed by running the app locally:
```bash
npm run dev
```
The following workflows were manually checked:

Login page loads correctly.
User can enter email/password and access the ride feed.
Ride cards are displayed with route, driver, date/time, seats, and price.
Search bar filters rides based on route, destination, driver, or college.
User can open a ride detail page.
User can submit a seat request and see pending status.
User can create a ride using the post ride form.
User can view driver dashboard request cards.
Driver can approve or reject pending requests.
Ride seat availability updates after approval in the frontend session.

Backend Endpoint Testing:

Backend endpoint testing was performed using a Node script that exercised the major API routes:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/rides`
- `GET /api/rides`
- `GET /api/rides/:id`
- `POST /api/requests`
- `PATCH /api/requests/:id/approve`
- `POST /api/messages`
- `GET /api/requests/:requestId/messages`
- `POST /api/ratings`
- `POST /api/reports`

The backend endpoint test confirmed that approving a seat request successfully reduced the ride’s available seats from 2 to 1.

User Acceptance Testing:

User acceptance testing was conducted through peer review during the final project fair. Reviewers interacted with the project and evaluated whether the main workflows were understandable and useful.

The main reviewed workflows were:

- Ride browsing
- Ride search
- Ride detail viewing
- Seat request workflow
- Create ride workflow
- Driver request management

Known Limitations:

- Frontend authentication is mocked for demo stability.
- The frontend can run in backend mode, but local backend/database setup may depend on each machine’s PostgreSQL configuration.
- Full production deployment has not been completed.

Seeded test users use the password: password123
