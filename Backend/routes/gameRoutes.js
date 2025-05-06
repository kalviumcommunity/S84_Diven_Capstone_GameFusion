const express = require('express');
const router = express.Router();
const { 
  getGames, 
  getGame, 
  createGame, 
  updateGame, 
  deleteGame 
} = require('../controllers/gameController');

// Get all games and create a new game
router.route('/')
  .get(getGames)
  .post(createGame);

// Get, update and delete a specific game
router.route('/:id')
  .get(getGame)
  .put(updateGame)
  .delete(deleteGame);

module.exports = router; 