const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Game title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Game description is required'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Game genre is required'],
    enum: {
      values: ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Simulation', 'Puzzle', 'Other'],
      message: '{VALUE} is not a supported genre'
    }
  },
  platform: {
    type: [String],
    required: [true, 'At least one platform is required'],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one platform must be specified'
    }
  },
  developer: {
    type: String,
    required: [true, 'Developer name is required'],
    trim: true
  },
  publisher: {
    type: String,
    required: false,
    trim: true
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be between 0 and 5'],
    max: [5, 'Rating must be between 0 and 5'],
    default: 0
  },
  images: [{
    type: String,
    required: false
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Relationships
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  // Track users who favorited this game
  favoritedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add an index for faster querying
gameSchema.index({ title: 1, genre: 1 });

// Virtual for game URL
gameSchema.virtual('url').get(function() {
  return `/games/${this._id}`;
});

// Virtual for average rating
gameSchema.virtual('averageRating').get(function() {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => {
      return sum + (review.rating || 0);
    }, 0);
    return totalRating / this.reviews.length;
  }
  return this.rating || 0;
});

// Method to check if a game is on sale
gameSchema.methods.isOnSale = function() {
  return this.price < 20;
};

// Pre middleware to populate reviews when finding a game
gameSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'reviews',
    select: 'rating title content user'
  });
  next();
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game; 