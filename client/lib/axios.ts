import axios from "axios";

// Create a custom axios instance that points to the unified API environment variable.
// During development, this will be http://localhost:5000. In production, this will
// point to the deployed server backend URL seamlessly.

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true, // Crucial for passing HttpOnly JWT cookies to the backend
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
