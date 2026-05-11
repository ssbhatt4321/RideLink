import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { authRoutes, rideRoutes, requestRoutes, messageRoutes, ratingRoutes, reportRoutes } from './routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register all routes
authRoutes(app);
rideRoutes(app);
requestRoutes(app);
messageRoutes(app);
ratingRoutes(app);
reportRoutes(app);

app.listen(PORT, () => {
  console.log(`RideLink API listening on port ${PORT}`);
});