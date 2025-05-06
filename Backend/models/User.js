const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in query results by default
  },
  firstName: {
    type: String,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'publisher'],
    default: 'user'
  },
  profileImage: {
    type: String,
    required: false
  },
  bio: {
    type: String,
    required: false,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  favoriteGames: [{
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }],
  publishedGames: [{
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create a full name virtual property
userSchema.virtual('fullName').get(function() {
  return this.firstName && this.lastName 
    ? `${this.firstName} ${this.lastName}`
    : this.username;
});

// Method to check if user is admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Method for adding a game to favorites
userSchema.methods.addGameToFavorites = async function(gameId) {
  if (!this.favoriteGames.includes(gameId)) {
    this.favoriteGames.push(gameId);
    await this.save();
    
    // Update the game's favoritedBy field
    await mongoose.model('Game').findByIdAndUpdate(
      gameId,
      { $addToSet: { favoritedBy: this._id } }
    );
  }
  return this;
};

// Method for removing a game from favorites
userSchema.methods.removeGameFromFavorites = async function(gameId) {
  if (this.favoriteGames.includes(gameId)) {
    this.favoriteGames = this.favoriteGames.filter(id => !id.equals(gameId));
    await this.save();
    
    // Update the game's favoritedBy field
    await mongoose.model('Game').findByIdAndUpdate(
      gameId,
      { $pull: { favoritedBy: this._id } }
    );
  }
  return this;
};

// Pre-save hook to update publishedGames when a user creates a game
userSchema.pre('save', async function(next) {
  next();
});

// Pre-save hook to check for duplicate emails
userSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    const existingUser = await this.constructor.findOne({ email: this.email, _id: { $ne: this._id } });
    if (existingUser) {
      const error = new Error('Email already in use');
      error.name = 'ValidationError';
      next(error);
      return;
    }
  }
  
  // Password hashing would happen here in production
  if (this.isModified('password')) {
    // this.password = await bcrypt.hash(this.password, 10);
    console.log('Password would be hashed here in production');
  }
  
  next();
});

// Recursively remove password and sensitive data from JSON responses
userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.emailVerificationToken;
    
    // Handle nested objects recursively
    const sanitizeObject = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      
      Object.keys(obj).forEach(key => {
        if (key === 'password' || key.includes('Token') || key.includes('Secret')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      });
    };
    
    // Sanitize any nested objects
    Object.keys(ret).forEach(key => {
      if (typeof ret[key] === 'object' && ret[key] !== null) {
        sanitizeObject(ret[key]);
      }
    });
    
    return ret;
  }
});

// Compound index for faster queries and to enforce uniqueness
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User; 