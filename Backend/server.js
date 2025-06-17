const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const gameRoutes = require('./routes/gameRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

console.log('Loading routes:', {
  gameRoutes: typeof gameRoutes,
  reviewRoutes: typeof reviewRoutes,
  userRoutes: typeof userRoutes
});

// Load env variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Debug route to test server
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Main routes
app.use('/api/games', gameRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Nested routes with proper parameter passing
app.use('/api/games/:gameId/reviews', (req, res, next) => {
  // This middleware ensures gameId is available to the reviewRoutes
  next();
}, reviewRoutes);

app.use('/api/users/:userId/reviews', (req, res, next) => {
  // This middleware ensures userId is available to the reviewRoutes
  next();
}, reviewRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/test`);
}); 