const Review = require('../models/Review');
const Game = require('../models/Game');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: 'user',
        select: 'username profileImage'
      })
      .populate({
        path: 'game',
        select: 'title'
      });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error in getAllReviews:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get reviews for a game
// @route   GET /api/games/:gameId/reviews
// @access  Public
exports.getGameReviews = async (req, res) => {
  try {
    console.log('Request params:', req.params);
    const gameId = req.params.gameId;

    if (!gameId) {
      return res.status(400).json({
        success: false,
        error: 'Game ID is required'
      });
    }

    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }

    const reviews = await Review.find({ game: gameId })
      .populate({
        path: 'user',
        select: 'username profileImage'
      });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error in getGameReviews:', error);
    
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

// @desc    Get reviews by a user
// @route   GET /api/users/:userId/reviews
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    console.log('User reviews - Request params:', req.params);
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const reviews = await Review.find({ user: userId })
      .populate({
        path: 'game',
        select: 'title images'
      });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error in getUserReviews:', error);
    
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

// @desc    Get a single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'username profileImage'
      })
      .populate({
        path: 'game',
        select: 'title images'
      });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in getReview:', error);
    
    // Handle invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create a review
// @route   POST /api/games/:gameId/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    console.log('Create review - Request params:', req.params);
    console.log('Create review - Request body:', req.body);
    
    const gameId = req.params.gameId;
    if (!gameId) {
      return res.status(400).json({
        success: false,
        error: 'Game ID is required'
      });
    }
    
    const userId = req.body.user || req.user?.id; // Assuming user auth middleware sets req.user
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found'
      });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if user already reviewed this game
    const existingReview = await Review.findOne({
      user: userId,
      game: gameId
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this game'
      });
    }
    
    // Create the review
    const reviewData = {
      ...req.body,
      user: userId,
      game: gameId
    };
    
    const review = await Review.create(reviewData);
    
    // Add review to user's reviews array
    await User.findByIdAndUpdate(userId, {
      $push: { reviews: review._id }
    });
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in createReview:', error);
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    // Duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this game'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Check if user owns the review (authorization)
    // In a real app, you'd check if req.user.id === review.user.toString()
    // For now, we'll skip this check for simplicity
    
    // Mark review as edited
    req.body.isEdited = true;
    
    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'user',
      select: 'username profileImage'
    }).populate({
      path: 'game',
      select: 'title'
    });
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in updateReview:', error);
    
    // Handle invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
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

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    // Check if user owns the review (authorization)
    // In a real app, you'd check if req.user.id === review.user.toString()
    // For now, we'll skip this check for simplicity
    
    const userId = review.user;
    const gameId = review.game;
    
    await review.deleteOne();
    
    // Remove review from user's reviews array
    await User.findByIdAndUpdate(userId, {
      $pull: { reviews: review._id }
    });
    
    // Remove review from game's reviews array
    await Game.findByIdAndUpdate(gameId, {
      $pull: { reviews: review._id }
    });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    
    // Handle invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 