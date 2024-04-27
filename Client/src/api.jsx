import axios from 'axios';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

// Add an interceptor to set the token in the request header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default axiosInstance;
