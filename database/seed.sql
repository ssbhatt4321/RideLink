-- RideLink Sample Data
-- Author: Anshuman Deodhar

INSERT INTO users (id, name, email, college, password_hash, rating_avg) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Shashank Bhatt', 'sbhatt@umass.edu', 'UMass Amherst', 'hashed_pw_1', 4.8),
  ('a1000000-0000-0000-0000-000000000002', 'Akshat Shrivastava', 'akshat@umass.edu', 'UMass Amherst', 'hashed_pw_2', 4.9),
  ('a1000000-0000-0000-0000-000000000003', 'Anshuman Deodhar', 'anshuman@umass.edu', 'UMass Amherst', 'hashed_pw_3', 5.0),
  ('a1000000-0000-0000-0000-000000000004', 'Maya Patel', 'mpatel@smith.edu', 'Smith College', 'hashed_pw_4', 4.5);

INSERT INTO rides (id, driver_id, origin, destination, departure, total_seats, available_seats, notes, status) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
   'UMass Amherst', 'Boston Logan Airport', '2026-04-12 09:00:00', 4, 2,
   'Leaving from Haigis Mall. Please be on time.', 'active'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003',
   'Amherst College', 'Walmart Amherst', '2026-04-11 17:30:00', 3, 3,
   NULL, 'active'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000004',
   'Smith College', 'Bradley Airport', '2026-04-13 07:15:00', 2, 1,
   'Terminal 1 drop-off.', 'active');

INSERT INTO seat_requests (id, ride_id, passenger_id, status) VALUES
  ('c1000000-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000002',
   'approved');

INSERT INTO messages (request_id, sender_id, content) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
   'Hey! I will be in the North Parking Lot by 6:45. Look for a grey Honda CR-V.'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002',
   'Perfect, I will be there!');
