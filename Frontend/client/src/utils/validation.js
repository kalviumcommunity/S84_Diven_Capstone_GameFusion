// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    message: password.length >= 6 ? '' : 'Password must be at least 6 characters long'
  };
};

export const validateUsername = (username) => {
  return {
    isValid: username.length >= 3 && username.length <= 20,
    message: username.length >= 3 && username.length <= 20 
      ? '' 
      : 'Username must be between 3 and 20 characters'
  };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '')
    .trim();
};

export const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return false;
  
  const trimmed = query.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
};
