const Game = require('../models/Game');

// @desc    Get all games
// @route   GET /api/games
// @access  Public
exports.getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (error) {
    console.error('Error in getGames:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single game
// @route   GET /api/games/:id
// @access  Public
exports.getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Error in getGame:', error);
    
    // Handle invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new game
// @route   POST /api/games
// @access  Private
exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    
    res.status(201).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Error in createGame:', error);
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update game
// @route   PUT /api/games/:id
// @access  Private
exports.updateGame = async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated game
        runValidators: true // Run model validators
      }
    );
    
    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Error in updateGame:', error);
    
    // Handle invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete game
// @route   DELETE /api/games/:id
// @access  Private
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    await game.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteGame:', error);
    
    // Handle invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 