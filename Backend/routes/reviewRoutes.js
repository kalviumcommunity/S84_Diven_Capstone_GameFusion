const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getGameReviews,
  getUserReviews
} = require('../controllers/reviewController');

// Routes that handle /api/reviews
router.route('/')
  .get(getAllReviews);

// Routes that handle /api/reviews/:id
router.route('/:id')
  .get(getReview)
  .put(updateReview)
  .delete(deleteReview);

// Routes that handle /api/games/:gameId/reviews - note the path is just /
// The gameId is available through mergeParams
router.route('/')
  .get(getGameReviews)
  .post(createReview);

// Routes that handle /api/users/:userId/reviews - note the path is just /
// The userId is available through mergeParams
router.route('/')
  .get(getUserReviews);

module.exports = router; 