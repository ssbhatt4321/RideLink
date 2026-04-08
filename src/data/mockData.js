export const mockUser = {
    id: 1,
    name: "Akshat Shrivastava",
    email: "akshat@umass.edu",
    college: "UMass Amherst",
    rating: 4.8,
    role: "passenger"
  };
  
  export const mockRides = [
    {
      id: 101,
      driverName: "Shashank Bhatt",
      driverCollege: "UMass Amherst",
      origin: "UMass Amherst",
      destination: "Boston Logan Airport",
      departureDate: "2026-04-12",
      departureTime: "09:00 AM",
      seatsTotal: 3,
      seatsAvailable: 2,
      price: "$18",
      notes: "Leaving from Haigis Mall. Please be on time.",
      status: "Available"
    },
    {
      id: 102,
      driverName: "Anshuman Deodhar",
      driverCollege: "Amherst College",
      origin: "Amherst College",
      destination: "Walmart Amherst",
      departureDate: "2026-04-11",
      departureTime: "05:30 PM",
      seatsTotal: 4,
      seatsAvailable: 3,
      price: "Free",
      notes: "Quick grocery run. Returning in about 1 hour.",
      status: "Available"
    },
    {
      id: 103,
      driverName: "Maya Patel",
      driverCollege: "Smith College",
      origin: "Smith College",
      destination: "Bradley Airport",
      departureDate: "2026-04-13",
      departureTime: "07:15 AM",
      seatsTotal: 2,
      seatsAvailable: 1,
      price: "$20",
      notes: "Small luggage only.",
      status: "Available"
    },
    {
      id: 104,
      driverName: "Jordan Lee",
      driverCollege: "Mount Holyoke College",
      origin: "Mount Holyoke College",
      destination: "UMass Amherst",
      departureDate: "2026-04-10",
      departureTime: "02:00 PM",
      seatsTotal: 3,
      seatsAvailable: 0,
      price: "$5",
      notes: "Ride is currently full.",
      status: "Full"
    }
  ];
  
  export const mockRequests = [
    {
      id: 201,
      rideId: 101,
      passengerName: "Akshat Shrivastava",
      requestedAt: "2026-04-07 4:15 PM",
      status: "Pending"
    },
    {
      id: 202,
      rideId: 102,
      passengerName: "Riya Shah",
      requestedAt: "2026-04-07 3:45 PM",
      status: "Approved"
    }
  ];
  
  export const mockMessages = [
    {
      id: 301,
      rideId: 101,
      sender: "Shashank Bhatt",
      text: "Hi! Pickup will be near Haigis Mall.",
      time: "4:30 PM"
    },
    {
      id: 302,
      rideId: 101,
      sender: "Akshat Shrivastava",
      text: "Sounds good, I’ll be there 10 minutes early.",
      time: "4:32 PM"
    }
  ];