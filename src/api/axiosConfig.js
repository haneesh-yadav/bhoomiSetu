import axios from 'axios';

// Base API URL — uses REACT_APP_API_URL env var in production, falls back to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach the JWT token
api.interceptors.request.use(
  (config) => {
    // We are storing the entire user object in localStorage as 'bhoomi_user'
    // but we need to extract the token from it
    const storedUserStr = localStorage.getItem('bhoomi_user');
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        if (storedUser && storedUser.token) {
          config.headers['Authorization'] = `Bearer ${storedUser.token}`;
        }
      } catch (e) {
        console.error("Failed to parse bhoomi_user from localStorage");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
