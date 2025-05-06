const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
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

// MongoDB Connection String - Replace <db_password> with your actual MongoDB password
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sainidiven:<db_password>@cluster0.x9rilt1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

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

// Debug route to test user creation directly
app.post('/test-user-create', async (req, res) => {
  try {
    const User = require('./models/User');
    console.log('Test user creation route accessed');
    console.log('Request body:', req.body);
    
    const user = await User.create(req.body);
    user.password = undefined;
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
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