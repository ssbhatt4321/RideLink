// Auto-generated from queries.sql

export const register_new_user = `INSERT INTO users (name, email, college, password_hash)
VALUES ($1, $2, $3, $4)
RETURNING id, name, email, college, rating_avg, created_at;`;

export const find_user_by_email_for_login = `SELECT id, name, email, college, password_hash, rating_avg
FROM users
WHERE email = $1;`;

export const get_user_profile_by_id = `SELECT id, name, email, college, rating_avg, created_at
FROM users
WHERE id = $1;`;

export const create_a_ride_posting = `INSERT INTO rides (driver_id, origin, destination, departure, total_seats, available_seats, notes)
VALUES ($1, $2, $3, $4, $5, $5, $6)
RETURNING *;`;

export const search_rides_by_origin_destination_date = `SELECT r.*, u.name AS driver_name, u.rating_avg AS driver_rating
FROM rides r
JOIN users u ON r.driver_id = u.id
WHERE r.status = 'active'
  AND r.available_seats > 0
  AND ($1::text IS NULL OR LOWER(r.origin) LIKE LOWER('%' || $1 || '%'))
  AND ($2::text IS NULL OR LOWER(r.destination) LIKE LOWER('%' || $2 || '%'))
  AND ($3::date IS NULL OR r.departure::date = $3::date)
ORDER BY r.departure ASC;`;

export const get_single_ride_detail = `SELECT r.*, u.name AS driver_name, u.rating_avg AS driver_rating, u.college AS driver_college
FROM rides r
JOIN users u ON r.driver_id = u.id
WHERE r.id = $1;`;

export const get_all_rides_posted_by_a_driver = `SELECT * FROM rides
WHERE driver_id = $1
ORDER BY departure DESC;`;

export const cancel_a_ride_driver_only_before_departure = `UPDATE rides
SET status = 'canceled'
WHERE id = $1
  AND driver_id = $2
  AND departure > NOW()
RETURNING *;`;

export const mark_ride_as_completed = `UPDATE rides
SET status = 'completed'
WHERE id = $1
RETURNING *;`;

export const get_all_pending_requests_for_a_driver_s_ride = `SELECT sr.*, u.name AS passenger_name, u.rating_avg AS passenger_rating, u.college
FROM seat_requests sr
JOIN users u ON sr.passenger_id = u.id
WHERE sr.ride_id = $1 AND sr.status = 'pending'
ORDER BY sr.requested_at ASC;`;

export const reject_a_seat_request = `UPDATE seat_requests
SET status = 'rejected'
WHERE id = $1 AND status = 'pending'
RETURNING *;`;

export const confirm_participation_passenger_confirms_after_approval = `UPDATE seat_requests
SET status = 'confirmed'
WHERE id = $1
  AND passenger_id = $2
  AND status = 'approved'
RETURNING *;`;

export const get_a_passenger_s_booking_history = `SELECT sr.*, r.origin, r.destination, r.departure, u.name AS driver_name
FROM seat_requests sr
JOIN rides r ON sr.ride_id = r.id
JOIN users u ON r.driver_id = u.id
WHERE sr.passenger_id = $1
ORDER BY r.departure DESC;`;

export const send_a_message_only_if_user_is_a_confirmed_participant = `INSERT INTO messages (request_id, sender_id, content)
SELECT $1, $2, $3
WHERE EXISTS (
  SELECT 1 FROM seat_requests sr
  JOIN rides r ON sr.ride_id = r.id
  WHERE sr.id = $1
    AND sr.status IN ('approved', 'confirmed')
    AND ($2 = sr.passenger_id OR $2 = r.driver_id)
)
RETURNING *;`;

export const get_all_messages_for_a_ride_chat = `SELECT m.*, u.name AS sender_name
FROM messages m
JOIN users u ON m.sender_id = u.id
WHERE m.request_id = $1
ORDER BY m.sent_at ASC;`;

export const submit_a_rating_after_ride_completion = `WITH new_rating AS (
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
WHERE id = $2;`;

export const get_all_ratings_for_a_user = `SELECT r.score, r.comment, r.created_at, u.name AS rater_name
FROM ratings r
JOIN users u ON r.rater_id = u.id
WHERE r.ratee_id = $1
ORDER BY r.created_at DESC;`;

export const submit_a_report = `INSERT INTO reports (reporter_id, reported_user_id, reported_ride_id, reason, details)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;`;

