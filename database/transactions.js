export const selectRideForUpdate = `SELECT id, available_seats FROM rides
WHERE id = $1 FOR UPDATE;`;

export const insertSeatRequestIfAvailable = `INSERT INTO seat_requests (ride_id, passenger_id, status)
SELECT $1, $2, 'pending'
WHERE (SELECT available_seats FROM rides WHERE id = $1) > 0
  AND EXISTS (SELECT 1 FROM users WHERE id = $2)
  AND NOT EXISTS (SELECT 1 FROM seat_requests WHERE ride_id = $1 AND passenger_id = $2)
RETURNING *;`;

export const approveSeatRequest = `UPDATE seat_requests
SET status = 'approved'
WHERE id = $1 AND status = 'pending'
RETURNING *;`;

export const decrementRideSeat = `UPDATE rides
SET available_seats = available_seats - 1
WHERE id = (SELECT ride_id FROM seat_requests WHERE id = $1)
  AND available_seats > 0
RETURNING *;`;

export const cancelBookingRequest = `UPDATE seat_requests
SET status = 'rejected'
WHERE id = $1 AND passenger_id = $2
RETURNING *;`;

export const returnRideSeat = `UPDATE rides
SET available_seats = available_seats + 1
WHERE id = (SELECT ride_id FROM seat_requests WHERE id = $1)
RETURNING *;`;

export const cancelRideAndRejectRequests = `UPDATE rides
SET status = 'canceled'
WHERE id = $1
  AND driver_id = $2
  AND departure > NOW();

UPDATE seat_requests
SET status = 'rejected'
WHERE ride_id = $1
  AND status IN ('pending', 'approved', 'confirmed');`;