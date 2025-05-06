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

module.exports = router; 