const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    trim: true,
    minlength: [10, 'Review content must be at least 10 characters long']
  },
  likes: {
    type: Number,
    default: 0
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate reviews
reviewSchema.index({ user: 1, game: 1 }, { unique: true });

// Static method to get average rating for a game
reviewSchema.statics.getAverageRating = async function(gameId) {
  const result = await this.aggregate([
    {
      $match: { game: gameId }
    },
    {
      $group: {
        _id: '$game',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  return result.length > 0 ? result[0].averageRating : 0;
};

// Method to check if review is helpful (example)
reviewSchema.methods.isHelpful = function() {
  return this.likes > 5;
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 