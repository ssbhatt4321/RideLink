# RideLink Build and Setup Instructions

This file explains how to install, run, build, and prepare the RideLink project for development and final review.

## Prerequisites

Install the following:

- Node.js 18 or newer
- npm
- Git
- PostgreSQL 16 or newer, if running the backend/database locally

Recommended editor:

- Visual Studio Code

## Clone the Repository

```bash
git clone https://github.com/ssbhatt4321/RideLink.git
cd RideLink
```


## Install Dependencies
```bash
npm install
```

## Run the Frontend Locally

```
npm run dev
```

After running the command, Vite will print a local development URL such as:

```
http://localhost:5173/
```

If port `5173` is already in use, Vite may use another port such as `5174` or `5175`.

## Build for Production

```
npm run build
```

This creates a production-ready build in the `dist/` folder.

## Preview Production Build

```
npm run preview
```

## Frontend Environment Variables

The frontend service layer supports switching between mock mode and backend mode.

Create a `.env.local` file in the project root.

For stable frontend demo mode:

```
VITE_API_BASE_URL=http://localhost:4000/apiVITE_USE_BACKEND=false
```

For backend integration mode:

```
VITE_API_BASE_URL=http://localhost:4000/apiVITE_USE_BACKEND=true
```

When `VITE_USE_BACKEND=false`, the frontend uses mock data through `src/services/api.js`.

When `VITE_USE_BACKEND=true`, the frontend attempts to call the Express backend API.

## Run the Backend Locally

The backend uses:

-   Node.js
-   Express.js
-   PostgreSQL

### Start the Backend Server

```
npm run server
```

The backend should run at:

```
http://localhost:4000
```

Health check endpoint:

```
curl http://localhost:4000/api/health
```

Expected response:

```
{  "status": "ok"}
```

## Database Setup

The project database uses PostgreSQL.

Expected setup flow:

1.  Create a PostgreSQL database named `ridelink`.
2.  Run the schema creation SQL.
3.  Run the seed data SQL.
4.  Configure backend `.env` with database credentials.

Example:

```
createdb ridelinkpsql ridelink < database/schema.sqlpsql ridelink < database/seed.sql
```

Example `.env` file for the backend:

```
DATABASE_URL=postgres://username:password@localhost:5432/ridelinkPORT=4000
```

For local machines where PostgreSQL uses trust authentication, the URL may be:

```
DATABASE_URL=postgres://username@localhost:5432/ridelinkPORT=4000
```

Do not commit `.env` or `.env.local` files.

## Testing

Current testing includes manual UI validation of the main frontend workflows:

-   Login navigation
-   Ride feed rendering
-   Ride search/filter
-   Ride detail view
-   Seat request state update
-   Create ride form submission
-   Driver dashboard request approval/rejection

Backend endpoint testing includes:

-   Health check
-   User registration
-   Ride creation
-   Ride search
-   Ride detail retrieval
-   Seat request creation
-   Seat request approval
-   Available seat update after approval
-   Message creation/retrieval
-   Ratings
-   Reports

## Deployment

Frontend deployment options:

-   Render
-   Netlify
-   Vercel

General frontend deployment process:

1.  Build the frontend with `npm run build`.
2.  Deploy the generated `dist/` folder.
3.  Set `VITE_API_BASE_URL` to the deployed backend API URL.
4.  Verify major workflows in the deployed environment.

Backend deployment options:

-   Render
-   Railway
-   Fly.io

General backend deployment process:

1.  Deploy the Express server.
2.  Configure the deployed PostgreSQL database.
3.  Set `DATABASE_URL` and `PORT` environment variables.
4.  Verify `/api/health`.
5.  Test major API endpoints.

## Troubleshooting

### Port Already in Use

If Vite reports that port `5173` is in use, it will automatically try another port.

### Missing Dependencies

Run:

```
npm install
```

### Frontend Does Not Load Correctly

Check:

-   Terminal for Vite errors
-   Browser console errors
-   Import paths in `src/App.jsx`
-   Whether all files are committed and pulled correctly

### Backend Does Not Connect to Database

Check:

-   PostgreSQL is running
-   The `ridelink` database exists
-   `DATABASE_URL` is correct
-   `database/schema.sql` and `database/seed.sql` have been run
-   `.env` is present locally but not committed

Seeded test users use the password: password123
