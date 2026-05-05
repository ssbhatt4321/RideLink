cat > database/queries.sql << 'EOF'
-- RideLink Query Library
-- Author: Anshuman Deodhar
-- These are the SQL queries Shashank plugs into the Express backend routes

-- =====================
-- AUTH / USERS
-- =====================

-- Register new user
INSERT INTO users (name, email, college, password_hash)
VALUES ($1, $2, $3, $4)
RETURNING id, name, email, college, rating_avg, created_at;

-- Find user by email (for login)
SELECT id, name, email, college, password_hash, rating_avg
FROM users
WHERE email = $1;

-- Get user profile by id
SELECT id, name, email, college, rating_avg, created_at
FROM users
WHERE id = $1;

-- =====================
-- RIDES
-- =====================

-- Create a ride posting
INSERT INTO rides (driver_id, origin, destination, departure, total_seats, available_seats, notes)
VALUES ($1, $2, $3, $4, $5, $5, $6)
RETURNING *;

-- Search rides by origin, destination, date
SELECT r.*, u.name AS driver_name, u.rating_avg AS driver_rating
FROM rides r
JOIN users u ON r.driver_id = u.id
WHERE r.status = 'active'
  AND r.available_seats > 0
  AND ($1::text IS NULL OR LOWER(r.origin) LIKE LOWER('%' || $1 || '%'))
  AND ($2::text IS NULL OR LOWER(r.destination) LIKE LOWER('%' || $2 || '%'))
  AND ($3::date IS NULL OR r.departure::date = $3::date)
ORDER BY r.departure ASC;

-- Get single ride detail
SELECT r.*, u.name AS driver_name, u.rating_avg AS driver_rating, u.college AS driver_college
FROM rides r
JOIN users u ON r.driver_id = u.id
WHERE r.id = $1;

-- Get all rides posted by a driver
SELECT * FROM rides
WHERE driver_id = $1
ORDER BY departure DESC;

-- Cancel a ride (driver only, before departure)
UPDATE rides
SET status = 'canceled'
WHERE id = $1
  AND driver_id = $2
  AND departure > NOW()
RETURNING *;

-- Mark ride as completed
UPDATE rides
SET status = 'completed'
WHERE id = $1
RETURNING *;

-- =====================
-- SEAT REQUESTS
-- =====================

-- Atomic seat request (prevents overbooking)
BEGIN;
  SELECT id, available_seats FROM rides
  WHERE id = $1 FOR UPDATE;

  INSERT INTO seat_requests (ride_id, passenger_id, status)
  SELECT $1, $2, 'pending'
  WHERE (SELECT available_seats FROM rides WHERE id = $1) > 0;
COMMIT;

-- Get all pending requests for a driver's ride
SELECT sr.*, u.name AS passenger_name, u.rating_avg AS passenger_rating, u.college
FROM seat_requests sr
JOIN users u ON sr.passenger_id = u.id
WHERE sr.ride_id = $1 AND sr.status = 'pending'
ORDER BY sr.requested_at ASC;

-- Approve a seat request and decrement available seats atomically
BEGIN;
  UPDATE seat_requests
  SET status = 'approved'
  WHERE id = $1 AND status = 'pending'
  RETURNING *;

  UPDATE rides
  SET available_seats = available_seats - 1
  WHERE id = (SELECT ride_id FROM seat_requests WHERE id = $1)
    AND available_seats > 0;
COMMIT;

-- Reject a seat request
UPDATE seat_requests
SET status = 'rejected'
WHERE id = $1 AND status = 'pending'
RETURNING *;

-- Confirm participation (passenger confirms after approval)
UPDATE seat_requests
SET status = 'confirmed'
WHERE id = $1
  AND passenger_id = $2
  AND status = 'approved'
RETURNING *;

-- Cancel a booking (passenger cancels, seat returned)
BEGIN;
  UPDATE seat_requests
  SET status = 'rejected'
  WHERE id = $1 AND passenger_id = $2
  RETURNING *;

  UPDATE rides
  SET available_seats = available_seats + 1
  WHERE id = (SELECT ride_id FROM seat_requests WHERE id = $1);
COMMIT;

-- Get a passenger's booking history
SELECT sr.*, r.origin, r.destination, r.departure, u.name AS driver_name
FROM seat_requests sr
JOIN rides r ON sr.ride_id = r.id
JOIN users u ON r.driver_id = u.id
WHERE sr.passenger_id = $1
ORDER BY r.departure DESC;

-- =====================
-- MESSAGING
-- =====================

-- Send a message (only if user is a confirmed participant)
INSERT INTO messages (request_id, sender_id, content)
SELECT $1, $2, $3
WHERE EXISTS (
  SELECT 1 FROM seat_requests sr
  JOIN rides r ON sr.ride_id = r.id
  WHERE sr.id = $1
    AND sr.status IN ('approved', 'confirmed')
    AND ($2 = sr.passenger_id OR $2 = r.driver_id)
)
RETURNING *;

-- Get all messages for a ride chat
SELECT m.*, u.name AS sender_name
FROM messages m
JOIN users u ON m.sender_id = u.id
WHERE m.request_id = $1
ORDER BY m.sent_at ASC;

-- =====================
-- RATINGS
-- =====================

-- Submit a rating after ride completion
WITH new_rating AS (
  INSERT INTO ratings (rater_id, ratee_id, ride_id, score, comment)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING ratee_id, score
)
UPDATE users
SET rating_avg = (
  SELECT ROUND(AVG(score)::numeric, 2)
  FROM ratings
  WHERE ratee_id = $2
)
WHERE id = $2;

-- Get all ratings for a user
SELECT r.score, r.comment, r.created_at, u.name AS rater_name
FROM ratings r
JOIN users u ON r.rater_id = u.id
WHERE r.ratee_id = $1
ORDER BY r.created_at DESC;

-- =====================
-- REPORTS
-- =====================

-- Submit a report
INSERT INTO reports (reporter_id, reported_user_id, reported_ride_id, reason, details)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
EOF