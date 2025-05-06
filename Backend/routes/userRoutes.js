const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Debug
console.log('User controller functions:', {
  getAllUsers: typeof getAllUsers,
  getUserById: typeof getUserById,
  createUser: typeof createUser,
  updateUser: typeof updateUser,
  deleteUser: typeof deleteUser
});

// Routes for /api/users
router.route('/')
  .get(getAllUsers)
  .post(createUser);

// Routes for /api/users/:id
router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router; 