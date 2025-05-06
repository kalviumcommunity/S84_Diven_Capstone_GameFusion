const express = require('express');
const router = express.Router();


router.get('/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});


router.get('/users', (req, res) => {
  
  res.json([
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' }
  ]);
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
  
  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: Date.now(), 
      ...newUser
    }
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
  
  if (userId === '999') {
    return res.status(404).json({
      error: 'User not found'
    });
  }
  
  res.json({
    message: `User ${userId} updated successfully`,
    user: {
      id: userId,
      ...updatedData
    }
  });
});

module.exports = router; 