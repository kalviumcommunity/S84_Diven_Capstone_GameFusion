const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
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
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
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

// Avoid returning password in JSON responses
userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  }
});

// Index for faster queries
userSchema.index({ email: 1, username: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User; 