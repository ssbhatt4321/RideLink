-- RideLink Database Unit Tests
-- Author: Anshuman Deodhar
-- Run these in pgAdmin to verify all core database behavior

-- =====================
-- TEST 1: Users table has 8 records
-- =====================
DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM users) = 8,
  'FAIL: Expected 8 users';
  RAISE NOTICE 'PASS: Users count correct';
END $$;

-- =====================
-- TEST 2: All colleges are valid Five College institutions
-- =====================
DO $$
BEGIN
  ASSERT (
    SELECT COUNT(*) FROM users
    WHERE college NOT IN (
      'UMass Amherst', 'Amherst College',
      'Hampshire College', 'Mount Holyoke College', 'Smith College'
    )
  ) = 0,
  'FAIL: Invalid college found in users';
  RAISE NOTICE 'PASS: All colleges are valid Five College institutions';
END $$;

-- =====================
-- TEST 3: No ride has available_seats > total_seats
-- =====================
DO $$
BEGIN
  ASSERT (
    SELECT COUNT(*) FROM rides
    WHERE available_seats > total_seats
  ) = 0,
  'FAIL: available_seats exceeds total_seats on some ride';
  RAISE NOTICE 'PASS: available_seats never exceeds total_seats';
END $$;

-- =====================
-- TEST 4: Full ride has 0 available seats
-- =====================
DO $$
BEGIN
  ASSERT (
    SELECT available_seats FROM rides
    WHERE id = 'b1000000-0000-0000-0000-000000000003'
  ) = 0,
  'FAIL: Full ride should have 0 available seats';
  RAISE NOTICE 'PASS: Full ride correctly shows 0 available seats';
END $$;

-- =====================
-- TEST 5: Canceled ride still exists with correct status
-- =====================
DO $$
BEGIN
  ASSERT (
    SELECT status FROM rides
    WHERE id = 'b1000000-0000-0000-0000-000000000004'
  ) = 'canceled',
  'FAIL: Canceled ride has wrong status';
  RAISE NOTICE 'PASS: Canceled ride status correct';
END $$;

-- =====================
-- TEST 6: A passenger cannot request the same ride twice
-- =====================
DO $$
BEGIN
  BEGIN
    INSERT INTO seat_requests (ride_id, passenger_id, status) VALUES
      ('b1000000-0000-0000-0000-000000000001',
       'a1000000-0000-0000-0000-000000000002',
       'pending');
    RAISE EXCEPTION 'FAIL: Duplicate seat request was allowed';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: Duplicate seat request correctly rejected';
  END;
END $$;

-- =====================
-- TEST 7: Messages only exist on approved/confirmed requests
-- =====================
DO $$
BEGIN
  ASSERT (
    SELECT COUNT(*) FROM messages m
    JOIN seat_requests sr ON m.request_id = sr.id
    WHERE sr.status NOT IN ('approved', 'confirmed')
  ) = 0,
  'FAIL: Message found on non-approved request';
  RAISE NOTICE 'PASS: All messages belong to approved or confirmed requests';
END $$;

-- =====================
-- TEST 8: Ratings only exist on completed rides
-- =====================
DO $$
BEGIN
  ASSERT (
    SELECT COUNT(*) FROM ratings r
    JOIN rides ri ON r.ride_id = ri.id
    WHERE ri.status != 'completed'
  ) = 0,
  'FAIL: Rating found on non-completed ride';
  RAISE NOTICE 'PASS: All ratings belong to completed rides';
END $$;

-- =====================
-- TEST 9: Rating score is between 1 and 5
-- =====================
DO $$
BEGIN
  ASSERT (
    SELECT COUNT(*) FROM ratings
    WHERE score < 1 OR score > 5
  ) = 0,
  'FAIL: Rating score out of range';
  RAISE NOTICE 'PASS: All rating scores are within valid range';
END $$;

-- =====================
-- TEST 10: Search query returns only active rides with seats
-- =====================
DO $$
DECLARE
  result_count INT;
BEGIN
  SELECT COUNT(*) INTO result_count
  FROM rides
  WHERE status = 'active'
    AND available_seats > 0
    AND LOWER(origin) LIKE LOWER('%UMass%');

  ASSERT result_count >= 1,
  'FAIL: Search returned no active rides from UMass';
  RAISE NOTICE 'PASS: Search query returns correct active rides';
END $$;

-- =====================
-- TEST 11: Driver cannot be a passenger on their own ride
-- =====================
DO $$
BEGIN
  ASSERT (
    SELECT COUNT(*) FROM seat_requests sr
    JOIN rides r ON sr.ride_id = r.id
    WHERE sr.passenger_id = r.driver_id
  ) = 0,
  'FAIL: Driver is also a passenger on their own ride';
  RAISE NOTICE 'PASS: No driver is a passenger on their own ride';
END $$;

-- =====================
-- TEST 12: Ride search performance (returns within reasonable time)
-- =====================
EXPLAIN ANALYZE
SELECT r.*, u.name AS driver_name
FROM rides r
JOIN users u ON r.driver_id = u.id
WHERE r.status = 'active'
  AND r.available_seats > 0
  AND LOWER(r.origin) LIKE LOWER('%UMass%')
ORDER BY r.departure ASC;