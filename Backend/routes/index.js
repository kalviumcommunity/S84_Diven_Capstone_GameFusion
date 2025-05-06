const express = require('express');
const router = express.Router();

// Mock database - in a real app, this would be a database
const users = [
  { id: '1', name: 'User 1', email: 'user1@example.com' },
  { id: '2', name: 'User 2', email: 'user2@example.com' },
  { id: '3', name: 'User 3', email: 'user3@example.com' }
];

// Example GET route
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// GET all users
router.get('/users', (req, res) => {
  res.json(users);
});

// GET a specific user
router.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }
  
  res.json(user);
});

router.post('/users', (req, res) => {
  const newUser = req.body;
  
  // Validate required fields
  if (!newUser.name) {
    return res.status(400).json({
      error: 'Missing required field: name'
    });
  }
  
  if (!newUser.email) {
    return res.status(400).json({
      error: 'Missing required field: email'
    });
  }
  
  const user = {
    id: Date.now().toString(),
    ...newUser
  };
  
  users.push(user);
  
  res.status(201).json({
    message: 'User created successfully',
    user
  });
});

router.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  
  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({
      error: 'No update data provided'
    });
  }
  
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  const updatedUser = {
    ...users[userIndex],
    ...updatedData
  };
  
  users[userIndex] = updatedUser;
  
  res.json({
    message: `User ${userId} updated successfully`,
    user: updatedUser
  });
});

module.exports = router; 