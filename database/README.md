# RideLink Database

**Author:** Anshuman Deodhar  
**DBMS:** PostgreSQL 18  

## Setup

1. Create the database:
CREATE DATABASE ridelink;

2. Run the schema:
psql -U postgres -d ridelink -f schema.sql

3. (Optional) Load sample data:
psql -U postgres -d ridelink -f seed.sql

## Connection string for backend
postgresql://postgres:<password>@localhost:5432/ridelink

## Tables
- users
- rides
- seat_requests
- messages
- ratings
- reports
