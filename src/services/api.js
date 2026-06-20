import axios from 'axios';

const api = axios.create({
  baseURL: '', // Empty base URL is resolved by Vite proxy configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically attach authorization token
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

// Response error handler helper
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ ...error, message });
  }
);

export default api;
