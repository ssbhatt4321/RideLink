import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import {
  register_new_user,
  find_user_by_email_for_login,
  get_user_profile_by_id,
  create_a_ride_posting,
  search_rides_by_origin_destination_date,
  get_single_ride_detail,
  get_all_rides_posted_by_a_driver,
  cancel_a_ride_driver_only_before_departure,
  mark_ride_as_completed,
  get_all_pending_requests_for_a_driver_s_ride,
  reject_a_seat_request,
  confirm_participation_passenger_confirms_after_approval,
  get_a_passenger_s_booking_history,
  send_a_message_only_if_user_is_a_confirmed_participant,
  get_all_messages_for_a_ride_chat,
  submit_a_rating_after_ride_completion,
  get_all_ratings_for_a_user,
  submit_a_report
} from './database/queries.js';
import * as tx from './database/transactions.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING,
});

export const authRoutes = (app) => {
  // Register new user
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, college, password } = req.body;
    if (!name || !email || !college || !password) {
      return res.status(400).json({ error: 'name, email, college, and password are required' });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const result = await pool.query(register_new_user, [name, email, college, passwordHash]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email is already registered' });
      }
      res.status(500).json({ error: 'Unable to register user' });
    }
  });

  // Find user by email (for login)
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    try {
      const result = await pool.query(find_user_by_email_for_login, [email]);
      if (!result.rows.length) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { password_hash, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to log in' });
    }
  });

  // Get user profile by id
  app.get('/api/users/:id', async (req, res) => {
    try {
      const result = await pool.query(get_user_profile_by_id, [req.params.id]);
      if (!result.rows.length) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to load user' });
    }
  });
};

export const rideRoutes = (app) => {
  // Create a ride posting
  app.post('/api/rides', async (req, res) => {
    const { driverId, origin, destination, departure, totalSeats, notes } = req.body;
    if (!driverId || !origin || !destination || !departure || !totalSeats) {
      return res.status(400).json({ error: 'driverId, origin, destination, departure, and totalSeats are required' });
    }

    try {
      const result = await pool.query(create_a_ride_posting, [driverId, origin, destination, departure, totalSeats, notes || null]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to create ride' });
    }
  });

  // Search rides by origin, destination, date
  app.get('/api/rides/search', async (req, res) => {
    try {
      const { origin = null, destination = null, departure = null } = req.query;
      const result = await pool.query(search_rides_by_origin_destination_date, [origin || null, destination || null, departure || null]);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to load rides' });
    }
  });

  // Search rides by query params on the base rides route as well
  app.get('/api/rides', async (req, res) => {
    try {
      const { origin = null, destination = null, departure = null } = req.query;
      const result = await pool.query(search_rides_by_origin_destination_date, [origin || null, destination || null, departure || null]);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to load rides' });
    }
  });

  // Get single ride detail
  app.get('/api/rides/:id', async (req, res) => {
    try {
      const result = await pool.query(get_single_ride_detail, [req.params.id]);
      if (!result.rows.length) {
        return res.status(404).json({ error: 'Ride not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to load ride details' });
    }
  });

  // Get all rides posted by a driver
  app.get('/api/drivers/:id/rides', async (req, res) => {
    try {
      const result = await pool.query(get_all_rides_posted_by_a_driver, [req.params.id]);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to load driver rides' });
    }
  });

  // Cancel a ride (driver only, before departure)
  app.patch('/api/rides/:id/cancel', async (req, res) => {
    const { driverId } = req.body;
    if (!driverId) {
      return res.status(400).json({ error: 'driverId is required to cancel a ride' });
    }

    try {
      const result = await pool.query(cancel_a_ride_driver_only_before_departure, [req.params.id, driverId]);
      if (!result.rows.length) {
        return res.status(404).json({ error: 'Ride not found or cannot be canceled' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to cancel ride' });
    }
  });

  // Mark ride as completed
  app.patch('/api/rides/:id/complete', async (req, res) => {
    try {
      const result = await pool.query(mark_ride_as_completed, [req.params.id]);
      if (!result.rows.length) {
        return res.status(404).json({ error: 'Ride not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to complete ride' });
    }
  });
};

export const requestRoutes = (app) => {
  // Atomic seat request (prevents overbooking)
  app.post('/api/requests', async (req, res) => {
    const { rideId, passengerId } = req.body;
    if (!rideId || !passengerId) {
      return res.status(400).json({ error: 'rideId and passengerId are required' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const rideResult = await client.query(tx.selectRideForUpdate, [rideId]);
      if (!rideResult.rows.length || rideResult.rows[0].available_seats <= 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'Ride is full or unavailable' });
      }

      const passengerResult = await client.query('SELECT 1 FROM users WHERE id = $1', [passengerId]);
      if (!passengerResult.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Passenger not found' });
      }

      const existingRequestResult = await client.query(
        'SELECT 1 FROM seat_requests WHERE ride_id = $1 AND passenger_id = $2',
        [rideId, passengerId]
      );
      if (existingRequestResult.rows.length) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'Seat request already exists' });
      }

      const insertResult = await client.query(tx.insertSeatRequestIfAvailable, [rideId, passengerId]);
      if (!insertResult.rows.length) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'Ride is full or unavailable' });
      }

      await client.query('COMMIT');
      res.status(201).json(insertResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Seat request already exists' });
      }
      if (error.code === '23503') {
        return res.status(404).json({ error: 'Passenger or ride not found' });
      }
      res.status(500).json({ error: 'Unable to request seat' });
    } finally {
      client.release();
    }
  });

  // Get all pending requests for a driver's ride
  app.get('/api/rides/:id/requests', async (req, res) => {
    try {
      const result = await pool.query(get_all_pending_requests_for_a_driver_s_ride, [req.params.id]);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to load pending requests' });
    }
  });

  // Approve a seat request and decrement available seats atomically
  app.patch('/api/requests/:id/approve', async (req, res) => {
    const requestId = req.params.id;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      const requestResult = await client.query(tx.approveSeatRequest, [requestId]);
      if (!requestResult.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Request not found or already processed' });
      }

      const rideResult = await client.query(tx.decrementRideSeat, [requestId]);
      if (!rideResult.rows.length) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'No seats available to approve this request' });
      }

      await client.query('COMMIT');
      res.json(requestResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ error: 'Unable to approve request' });
    } finally {
      client.release();
    }
  });

  // Reject a seat request
  app.patch('/api/requests/:id/reject', async (req, res) => {
    try {
      const result = await pool.query(reject_a_seat_request, [req.params.id]);
      if (!result.rows.length) {
        return res.status(404).json({ error: 'Request not found or not pending' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to reject request' });
    }
  });

  // Confirm participation (passenger confirms after approval)
  app.patch('/api/requests/:id/confirm', async (req, res) => {
    const { passengerId } = req.body;
    if (!passengerId) {
      return res.status(400).json({ error: 'passengerId is required' });
    }

    try {
      const result = await pool.query(confirm_participation_passenger_confirms_after_approval, [req.params.id, passengerId]);
      if (!result.rows.length) {
        return res.status(404).json({ error: 'Request not found or not approved' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to confirm request' });
    }
  });

  // Cancel a booking (passenger cancels, seat returned)
  app.delete('/api/requests/:id', async (req, res) => {
    const { passengerId } = req.body;
    if (!passengerId) {
      return res.status(400).json({ error: 'passengerId is required to cancel booking' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const requestResult = await client.query(tx.cancelBookingRequest, [req.params.id, passengerId]);
      if (!requestResult.rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Booking not found or cannot be cancelled' });
    }

      await client.query(tx.returnRideSeat, [req.params.id]);
      await client.query('COMMIT');
      res.json(requestResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(error);
      res.status(500).json({ error: 'Unable to cancel booking' });
    } finally {
      client.release();
    }
  });

  // Get a passenger's booking history
  app.get('/api/passengers/:id/history', async (req, res) => {
    try {
      const result = await pool.query(get_a_passenger_s_booking_history, [req.params.id]);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to load booking history' });
    }
  });
};

export const messageRoutes = (app) => {
  // Send a message (only if user is a confirmed participant)
  app.post('/api/messages', async (req, res) => {
    const { requestId, senderId, content } = req.body;
    if (!requestId || !senderId || !content) {
      return res.status(400).json({ error: 'requestId, senderId, and content are required' });
    }

    try {
      const result = await pool.query(send_a_message_only_if_user_is_a_confirmed_participant, [requestId, senderId, content]);
      if (!result.rows.length) {
        return res.status(403).json({ error: 'Cannot send message for this request' });
      }
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to send message' });
    }
  });

  // Get all messages for a ride chat
  app.get('/api/requests/:id/messages', async (req, res) => {
    try {
      const result = await pool.query(get_all_messages_for_a_ride_chat, [req.params.id]);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to load messages' });
    }
  });
};

export const ratingRoutes = (app) => {
  // Submit a rating after ride completion
  app.post('/api/ratings', async (req, res) => {
    const { raterId, rateeId, rideId, score, comment } = req.body;
    if (!raterId || !rateeId || !rideId || !score) {
      return res.status(400).json({ error: 'raterId, rateeId, rideId, and score are required' });
    }

    try {
      await pool.query(submit_a_rating_after_ride_completion, [raterId, rateeId, rideId, score, comment || null]);
      res.status(201).json({ message: 'Rating submitted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to submit rating' });
    }
  });

  // Get all ratings for a user
  app.get('/api/users/:id/ratings', async (req, res) => {
    try {
      const result = await pool.query(get_all_ratings_for_a_user, [req.params.id]);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to load ratings' });
    }
  });
};

export const reportRoutes = (app) => {
  // Submit a report
  app.post('/api/reports', async (req, res) => {
    const { reporterId, reportedUserId, reportedRideId, reason, details } = req.body;
    if (!reporterId || !reason) {
      return res.status(400).json({ error: 'reporterId and reason are required' });
    }

    try {
      const result = await pool.query(submit_a_report, [reporterId, reportedUserId || null, reportedRideId || null, reason, details || null]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to submit report' });
    }
  });
};