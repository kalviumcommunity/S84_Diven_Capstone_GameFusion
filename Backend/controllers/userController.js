const User = require('../models/User');
const Game = require('../models/Game');
const Review = require('../models/Review');
const mongoose = require('mongoose');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'favoriteGames',
        select: 'title genre platform images'
      })
      .populate({
        path: 'reviews',
        select: 'rating title content game',
        populate: {
          path: 'game',
          select: 'title'
        }
      });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in getUserById:', error);
    
    // Handle invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    // In production, you would hash the password here
    // req.body.password = await bcrypt.hash(req.body.password, 10);
    
    const user = await User.create(req.body);
    
    // Don't return the password
    user.password = undefined;
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in createUser:', error);
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    // Don't allow password updates with this endpoint
    if (req.body.password) {
      delete req.body.password;
    }
    
    // Find user
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update user
    user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    
    // Handle invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
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
    
    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email or username already in use'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    console.log('Delete user - Request params:', req.params);
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Start a session for transaction-like operations
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 1. Delete all reviews by this user
      const reviews = await Review.find({ user: userId });
      
      for (const review of reviews) {
        // Remove the review from the game's reviews array
        await Game.findByIdAndUpdate(
          review.game,
          { $pull: { reviews: review._id } },
          { session }
        );
        
        // Delete the review
        await Review.findByIdAndDelete(review._id, { session });
      }
      
      // 2. Remove user from games' favoritedBy arrays
      await Game.updateMany(
        { favoritedBy: userId },
        { $pull: { favoritedBy: userId } },
        { session }
      );
      
      // 3. Handle user's published games
      // In a real app, you might want to:
      // - Delete them
      // - Transfer ownership
      // - Or keep them but mark them as orphaned
      // Here, we'll just remove the user reference
      await Game.updateMany(
        { created_by: userId },
        { $unset: { created_by: "" } },
        { session }
      );
      
      // 4. Delete the user
      await User.findByIdAndDelete(userId, { session });
      
      // Commit the transaction
      await session.commitTransaction();
      
      res.status(200).json({
        success: true,
        message: 'User and related data deleted successfully',
        data: {}
      });
    } catch (error) {
      // If an error occurred, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
  } catch (error) {
    console.error('Error in deleteUser:', error);
    
    // Handle invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 