```markdown
# RideLink

RideLink is a campus ride and carpool coordination platform for the Five College community. The system helps students post rides, search available rides, request seats, and coordinate transportation in a more structured and reliable way than informal group chats or social media.

This project was developed for CS 520: Software Engineering at UMass Amherst.

## Team Members

- Akshat Shrivastava
- Shashank Bhatt
- Anshuman Deodhar

## Project Goals

RideLink is designed to support the following main workflows:

- Student login / authentication flow
- Ride posting by drivers
- Ride browsing and searching by passengers
- Ride detail viewing
- Seat request submission
- Driver-side request approval / rejection
- Future support for messaging, ratings, and reporting

## Current Prototype Status

The current prototype includes:

- React frontend
- Express backend API
- PostgreSQL database schema and seed data
- Login page with mock authentication support
- Ride feed with search and filtering
- Reusable ride cards
- Ride detail page
- Seat request interaction with pending status
- Create ride page
- Driver dashboard with approve/reject request workflow
- Frontend service layer that can switch between mock mode and backend mode

The frontend can run in mock mode for demo stability or backend mode for integration testing.

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- PostgreSQL

### Testing / Evaluation

- Manual UI testing
- Backend endpoint testing script
- Planned/optional frontend unit testing with Vitest or Jest
- Planned/optional integration testing between frontend and backend

## Repository Structure

```text
RideLink/
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── queries.sql
│   ├── tests.sql
│   └── transactions.sql
├── docs/
│   └── API.md
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── RequestCard.jsx
│   │   ├── RideCard.jsx
│   │   └── SearchBar.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── pages/
│   │   ├── CreateRidePage.jsx
│   │   ├── DriverDashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RideDetailPage.jsx
│   │   └── RideFeedPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── BUILD.md
├── README.md
├── package.json
├── routes.js
├── server.js
└── vite.config.js

How to Run Locally?

Install dependencies:

npm install

Start the frontend development server:

npm run dev

Then open the local URL printed by Vite, usually:

http://localhost:5173/

Start the backend server:

npm run server

The backend runs at:

http://localhost:4000

Health check:

curl http://localhost:4000/api/health

Expected response:

{"status":"ok"}

Environment Variables:

For frontend mock mode, create .env.local:

VITE_API_BASE_URL=http://localhost:4000/api
VITE_USE_BACKEND=false

For backend integration mode:

VITE_API_BASE_URL=http://localhost:4000/api
VITE_USE_BACKEND=true

For backend database connection, create .env:

DATABASE_URL=postgres://username:password@localhost:5432/ridelink
PORT=4000

Do not commit .env or .env.local.

Available Scripts:
npm run dev

Runs the frontend locally in development mode.

npm run server

Runs the Express backend server.

npm run build

Creates a production frontend build in the dist/ folder.

npm run preview

Previews the production frontend build locally.

npm run lint

Runs linting checks.

API Documentation

See:

docs/API.md

Build Instructions

See:

BUILD.md

Development Process:

The team followed a sprint-based development process. Work was organized through GitHub branches, commits, and planned pull requests. Completed issues should be closed but not deleted, so progress remains traceable.

Notes:

The frontend can run independently in mock mode for reliable demonstration. Backend/database integration is supported through the frontend service layer in src/services/api.js.