-- Expanded seed data covering all use cases and edge cases

-- USERS
INSERT INTO users (id, name, email, college, password_hash, rating_avg) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Shashank Bhatt', 'sbhatt@umass.edu', 'UMass Amherst', '$2b$10$i6mlEmEO0An9mjGboXMGE.WECPlqwB8ciG8WI/lGpXA9fMCa/MZBm', 4.8),
  ('a1000000-0000-0000-0000-000000000002', 'Akshat Shrivastava', 'akshat@umass.edu', 'UMass Amherst', '$2b$10$i6mlEmEO0An9mjGboXMGE.WECPlqwB8ciG8WI/lGpXA9fMCa/MZBm', 4.9),
  ('a1000000-0000-0000-0000-000000000003', 'Anshuman Deodhar', 'anshuman@umass.edu', 'UMass Amherst', '$2b$10$i6mlEmEO0An9mjGboXMGE.WECPlqwB8ciG8WI/lGpXA9fMCa/MZBm', 5.0),
  ('a1000000-0000-0000-0000-000000000004', 'Maya Patel', 'mpatel@smith.edu', 'Smith College', '$2b$10$i6mlEmEO0An9mjGboXMGE.WECPlqwB8ciG8WI/lGpXA9fMCa/MZBm', 4.5),
  ('a1000000-0000-0000-0000-000000000005', 'Jordan Lee', 'jlee@mtholyoke.edu', 'Mount Holyoke College', '$2b$10$i6mlEmEO0An9mjGboXMGE.WECPlqwB8ciG8WI/lGpXA9fMCa/MZBm', 4.2),
  ('a1000000-0000-0000-0000-000000000006', 'Priya Nair', 'pnair@hampshire.edu', 'Hampshire College', '$2b$10$i6mlEmEO0An9mjGboXMGE.WECPlqwB8ciG8WI/lGpXA9fMCa/MZBm', 3.9),
  ('a1000000-0000-0000-0000-000000000007', 'Chris Wang', 'cwang@amherst.edu', 'Amherst College', '$2b$10$i6mlEmEO0An9mjGboXMGE.WECPlqwB8ciG8WI/lGpXA9fMCa/MZBm', 4.7),
  ('a1000000-0000-0000-0000-000000000008', 'Sofia Russo', 'srusso@smith.edu', 'Smith College', '$2b$10$i6mlEmEO0An9mjGboXMGE.WECPlqwB8ciG8WI/lGpXA9fMCa/MZBm', 4.6);

-- RIDES (active, full, canceled, completed)
INSERT INTO rides (id, driver_id, origin, destination, departure, total_seats, available_seats, notes, status) VALUES
  -- Active with seats available
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
   'UMass Amherst', 'Boston Logan Airport', '2026-04-12 09:00:00', 4, 2,
   'Leaving from Haigis Mall. Please be on time.', 'active'),

  -- Active with only 1 seat left
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004',
   'Smith College', 'Bradley Airport', '2026-04-13 07:15:00', 2, 1,
   'Terminal 1 drop-off.', 'active'),

  -- Full ride (0 seats available)
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000007',
   'Amherst College', 'Walmart Amherst', '2026-04-11 17:30:00', 3, 0,
   NULL, 'active'),

  -- Canceled ride
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005',
   'Mount Holyoke College', 'Springfield Union Station', '2026-04-10 08:00:00', 3, 3,
   'Plans changed.', 'canceled'),

  -- Completed ride
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001',
   'UMass Amherst', 'Providence, RI', '2026-03-28 10:00:00', 3, 0,
   'All seats filled.', 'completed'),

  -- Active, upcoming, multiple seats
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003',
   'UMass Amherst', 'New York City', '2026-04-18 06:00:00', 4, 3,
   'Leaving from Southwest residential area.', 'active');

-- SEAT REQUESTS (pending, approved, rejected, confirmed)
INSERT INTO seat_requests (id, ride_id, passenger_id, status) VALUES
  -- Approved request on ride 1
  ('c1000000-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000002', 'approved'),

  -- Pending request on ride 1
  ('c1000000-0000-0000-0000-000000000002',
   'b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000006', 'pending'),

  -- Rejected request on ride 2
  ('c1000000-0000-0000-0000-000000000003',
   'b1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000003', 'rejected'),

  -- Confirmed request on ride 2
  ('c1000000-0000-0000-0000-000000000004',
   'b1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000008', 'confirmed'),

  -- All 3 seats filled on ride 3
  ('c1000000-0000-0000-0000-000000000005',
   'b1000000-0000-0000-0000-000000000003',
   'a1000000-0000-0000-0000-000000000002', 'confirmed'),
  ('c1000000-0000-0000-0000-000000000006',
   'b1000000-0000-0000-0000-000000000003',
   'a1000000-0000-0000-0000-000000000005', 'confirmed'),
  ('c1000000-0000-0000-0000-000000000007',
   'b1000000-0000-0000-0000-000000000003',
   'a1000000-0000-0000-0000-000000000006', 'confirmed'),

  -- Completed ride requests
  ('c1000000-0000-0000-0000-000000000008',
   'b1000000-0000-0000-0000-000000000005',
   'a1000000-0000-0000-0000-000000000002', 'confirmed'),
  ('c1000000-0000-0000-0000-000000000009',
   'b1000000-0000-0000-0000-000000000005',
   'a1000000-0000-0000-0000-000000000004', 'confirmed'),

  -- Pending request on ride 6
  ('c1000000-0000-0000-0000-000000000010',
   'b1000000-0000-0000-0000-000000000006',
   'a1000000-0000-0000-0000-000000000007', 'pending');

-- MESSAGES (on approved/confirmed requests)
INSERT INTO messages (request_id, sender_id, content) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
   'Hey! I will be in the North Parking Lot by 6:45. Look for a grey Honda CR-V.'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002',
   'Perfect, I will be there! Can we stop at Terminal 2?'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
   'Sure, no problem!'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004',
   'Hi! Where exactly is the pickup spot?'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000008',
   'Front entrance of Neilson Library.');

-- RATINGS (only on completed ride)
INSERT INTO ratings (rater_id, ratee_id, ride_id, score, comment) VALUES
  ('a1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000005', 5, 'Great driver, very punctual!'),
  ('a1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000005', 4, 'Good ride, friendly driver.'),
  ('a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002',
   'b1000000-0000-0000-0000-000000000005', 5, 'Great passenger, on time!'),
  ('a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004',
   'b1000000-0000-0000-0000-000000000005', 4, 'Good passenger.');

-- REPORTS
INSERT INTO reports (reporter_id, reported_user_id, reported_ride_id, reason, details) VALUES
  ('a1000000-0000-0000-0000-000000000006',
   'a1000000-0000-0000-0000-000000000005', NULL,
   'Inappropriate behavior', 'Driver was rude during pickup coordination.'),
  ('a1000000-0000-0000-0000-000000000003', NULL,
   'b1000000-0000-0000-0000-000000000004',
   'Misleading ride info', 'Ride was canceled without notice.');