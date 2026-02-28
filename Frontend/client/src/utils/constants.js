// Application constants

export const ROUTES = {
  HOME: '/',
  GAMES: '/second',
  AUTH: '/auth',
  WISHLIST: '/wishlist',
  SEARCH: '/search'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const STORAGE_KEYS = {
  WISHLIST: 'wishlist',
  THEME: 'theme',
  USER: 'user'
};

export const API_ENDPOINTS = {
  GAMES: '/games',
  USERS: '/users',
  REVIEWS: '/reviews'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'Failed to fetch data. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please login again.'
};

export const SUCCESS_MESSAGES = {
  WISHLIST_ADDED: 'Added to wishlist!',
  WISHLIST_REMOVED: 'Removed from wishlist!',
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!'
};

export const GAME_GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Sports',
  'Simulation',
  'Puzzle',
  'Other'
];

export const PLATFORMS = [
  'PC',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'Mobile',
  'Other'
];
