cat > database/transactions.sql << 'EOF'
-- RideLink Critical Transactions
-- Author: Anshuman Deodhar
-- Handles concurrency-sensitive operations (NFR: prevent overbooking)

-- =====================
-- 1. REQUEST A SEAT (atomic, prevents overbooking)
-- =====================
-- Replace UUIDs with actual $1 (ride_id) and $2 (passenger_id) in backend
BEGIN;
  SELECT id, available_seats FROM rides
  WHERE id = $1 FOR UPDATE;

  INSERT INTO seat_requests (ride_id, passenger_id, status)
  SELECT $1, $2, 'pending'
  WHERE (SELECT available_seats FROM rides WHERE id = $1) > 0;
COMMIT;

-- =====================
-- 2. APPROVE REQUEST + DECREMENT SEAT (atomic)
-- =====================
-- Replace $1 with seat_request_id
BEGIN;
  UPDATE seat_requests
  SET status = 'approved'
  WHERE id = $1 AND status = 'pending';

  UPDATE rides
  SET available_seats = available_seats - 1
  WHERE id = (SELECT ride_id FROM seat_requests WHERE id = $1)
    AND available_seats > 0;
COMMIT;

-- =====================
-- 3. CANCEL BOOKING + RETURN SEAT (atomic)
-- =====================
-- Replace $1 with seat_request_id, $2 with passenger_id
BEGIN;
  UPDATE seat_requests
  SET status = 'rejected'
  WHERE id = $1 AND passenger_id = $2;

  UPDATE rides
  SET available_seats = available_seats + 1
  WHERE id = (SELECT ride_id FROM seat_requests WHERE id = $1);
COMMIT;

-- =====================
-- 4. CANCEL RIDE + NOTIFY ALL PASSENGERS (atomic)
-- =====================
-- Replace $1 with ride_id, $2 with driver_id
BEGIN;
  UPDATE rides
  SET status = 'canceled'
  WHERE id = $1
    AND driver_id = $2
    AND departure > NOW();

  UPDATE seat_requests
  SET status = 'rejected'
  WHERE ride_id = $1
    AND status IN ('pending', 'approved', 'confirmed');
COMMIT;
EOF