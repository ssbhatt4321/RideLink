import 'dotenv/config';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const headers = {
  'Content-Type': 'application/json',
};

const TEST_SUFFIX = Date.now();
const DRIVER_EMAIL = `driver-${TEST_SUFFIX}@example.com`;
const PASSENGER_EMAIL = `passenger-${TEST_SUFFIX}@example.com`;

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch (error) {
    body = text;
  }

  return { status: response.status, body };
}

function print(title, result) {
  console.log(`\n=== ${title} ===`);
  console.log(`status: ${result.status}`);
  console.log(`body: ${JSON.stringify(result.body, null, 2)}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  console.log(`Testing API at: ${API_BASE_URL}`);

  const health = await request('/health');
  print('Health', health);
  assert(health.status === 200, 'Health check failed');

  const driverRegister = await request('/auth/register', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Test Driver',
      email: DRIVER_EMAIL,
      college: 'Test College',
      password: 'Password123',
    }),
  });
  print('Register Driver', driverRegister);
  assert(driverRegister.status === 201, 'Driver registration failed');

  const passengerRegister = await request('/auth/register', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Test Passenger',
      email: PASSENGER_EMAIL,
      college: 'Test College',
      password: 'Password123',
    }),
  });
  print('Register Passenger', passengerRegister);
  assert(passengerRegister.status === 201, 'Passenger registration failed');

  const driverLogin = await request('/auth/login', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: DRIVER_EMAIL, password: 'Password123' }),
  });
  print('Login Driver', driverLogin);
  assert(driverLogin.status === 200, 'Driver login failed');

  const passengerLogin = await request('/auth/login', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: PASSENGER_EMAIL, password: 'Password123' }),
  });
  print('Login Passenger', passengerLogin);
  assert(passengerLogin.status === 200, 'Passenger login failed');

  const driverId = driverRegister.body.id;
  const passengerId = passengerRegister.body.id;

  const driverProfile = await request(`/users/${driverId}`);
  print('Driver Profile', driverProfile);
  assert(driverProfile.status === 200, 'Driver profile lookup failed');

  const passengerProfile = await request(`/users/${passengerId}`);
  print('Passenger Profile', passengerProfile);
  assert(passengerProfile.status === 200, 'Passenger profile lookup failed');

  const rideCreate = await request('/rides', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      driverId,
      origin: 'Test Origin',
      destination: 'Test Destination',
      departure: '2026-12-01T10:00:00.000Z',
      totalSeats: 3,
      notes: 'Test ride created by endpoint test',
    }),
  });
  print('Create Ride', rideCreate);
  assert(rideCreate.status === 201, 'Create ride failed');

  const rideId = rideCreate.body.id;

  const searchRides = await request('/rides/search?origin=Test%20Origin&destination=Test%20Destination&departure=2026-12-01');
  print('Search Rides', searchRides);
  assert(searchRides.status === 200, 'Search rides failed');

  const listRides = await request('/rides');
  print('List Rides', listRides);
  assert(listRides.status === 200, 'List rides failed');

  const rideDetail = await request(`/rides/${rideId}`);
  print('Ride Detail', rideDetail);
  assert(rideDetail.status === 200, 'Ride detail failed');

  const driverRides = await request(`/drivers/${driverId}/rides`);
  print('Driver Rides', driverRides);
  assert(driverRides.status === 200, 'Driver rides lookup failed');

  const seatRequest1 = await request('/requests', {
    method: 'POST',
    headers,
    body: JSON.stringify({ rideId, passengerId }),
  });
  print('Create Seat Request', seatRequest1);
  assert(seatRequest1.status === 201, 'Create seat request failed');

  const requestId1 = seatRequest1.body.id;

  const rideRequests = await request(`/rides/${rideId}/requests`);
  print('Ride Requests', rideRequests);
  assert(rideRequests.status === 200, 'Get ride requests failed');

  const approveRequest = await request(`/requests/${requestId1}/approve`, {
    method: 'PATCH',
  });
  print('Approve Request', approveRequest);
  assert(approveRequest.status === 200, 'Approve request failed');

  const seatRequest2 = await request('/requests', {
    method: 'POST',
    headers,
    body: JSON.stringify({ rideId, passengerId }),
  });
  print('Duplicate Seat Request', seatRequest2);

  const requestHistory = await request(`/passengers/${passengerId}/history`);
  print('Passenger Booking History', requestHistory);
  assert(requestHistory.status === 200, 'Passenger booking history failed');

  const messageCreate = await request('/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      requestId: requestId1,
      senderId: driverId,
      content: 'Hello from endpoint test',
    }),
  });
  print('Create Message', messageCreate);
  assert(messageCreate.status === 201, 'Create message failed');

  const messagesList = await request(`/requests/${requestId1}/messages`);
  print('Get Messages', messagesList);
  assert(messagesList.status === 200, 'Get messages failed');

  const ratingCreate = await request('/ratings', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      raterId: passengerId,
      rateeId: driverId,
      rideId,
      score: 5,
      comment: 'Endpoint test rating',
    }),
  });
  print('Create Rating', ratingCreate);
  assert(ratingCreate.status === 201, 'Create rating failed');

  const ratingsList = await request(`/users/${driverId}/ratings`);
  print('Driver Ratings', ratingsList);
  assert(ratingsList.status === 200, 'Get driver ratings failed');

  const reportCreate = await request('/reports', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      reporterId: passengerId,
      reportedId: driverId,
      reason: 'Endpoint test report',
      description: 'Reporting endpoint test',
    }),
  });
  print('Create Report', reportCreate);
  assert(reportCreate.status === 201, 'Create report failed');

  console.log('\nAll endpoint checks completed successfully.');
}

run().catch((error) => {
  console.error('\nTest script failed:', error);
  process.exit(1);
});
