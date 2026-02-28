// API Configuration
export const API_CONFIG = {
  RAWG_API_KEY: import.meta.env.VITE_RAWG_API_KEY || 'dbb830f2fcc14d9bad3250b12c241e01',
  RAWG_API_BASE_URL: import.meta.env.VITE_RAWG_API_BASE_URL || 'https://api.rawg.io/api',
  BACKEND_API_URL: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000/api'
};

// Helper function to build RAWG API URLs
export const buildRawgUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_CONFIG.RAWG_API_BASE_URL}${endpoint}`);
  url.searchParams.append('key', API_CONFIG.RAWG_API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};
