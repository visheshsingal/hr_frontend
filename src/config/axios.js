import axios from 'axios';

// Get the API URL from environment variables
const getApiUrl = () => {
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_URL || 'https://hr-backend-pamu.onrender.com';
  }
  
  // In production, use the environment variable
  return process.env.REACT_APP_API_URL;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 