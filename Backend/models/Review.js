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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to prevent duplicate reviews
reviewSchema.index({ user: 1, game: 1 }, { unique: true });

// Pre-save hook to update the game's reviews array
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      await mongoose.model('Game').findByIdAndUpdate(
        this.game,
        { $push: { reviews: this._id } }
      );
    } catch (error) {
      console.error('Error updating game with review:', error);
    }
  }
  next();
});

// Pre-remove hook to remove the review from the game's reviews array
reviewSchema.pre('remove', async function(next) {
  try {
    await mongoose.model('Game').findByIdAndUpdate(
      this.game,
      { $pull: { reviews: this._id } }
    );
  } catch (error) {
    console.error('Error removing review from game:', error);
  }
  next();
});

// Static method to get average rating for a game
reviewSchema.statics.getAverageRating = async function(gameId) {
  const result = await this.aggregate([
    {
      $match: { game: mongoose.Types.ObjectId(gameId) }
    },
    {
      $group: {
        _id: '$game',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (result.length > 0) {
      await mongoose.model('Game').findByIdAndUpdate(gameId, {
        rating: result[0].averageRating
      });
    }
  } catch (error) {
    console.error('Error updating game rating:', error);
  }
};

// Call getAverageRating after saving a review
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.game);
});

// Call getAverageRating after removing a review
reviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.game);
});

// Auto-populate the user field when querying reviews
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username profileImage'
  });
  next();
});

// Method to check if review is helpful (example)
reviewSchema.methods.isHelpful = function() {
  return this.likes > 5;
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 