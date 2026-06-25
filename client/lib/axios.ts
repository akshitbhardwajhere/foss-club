import axios from "axios";

/**
 * Custom Axios Client Configuration
 * 
 * Configures the base HTTP communications pipeline.
 * Pulls backend address dynamically from NEXT_PUBLIC_API_URL, defaulting to http://localhost:5000.
 */
const api = axios.create({
  // Sanitize the URL by trimming trailing slashes to avoid double-slash route failures
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
    /\/$/,
    "",
  ),
  // withCredentials: true ensures HttpOnly cookies (JWT authentication tokens)
  // are transmitted automatically along with fetch/axios requests.
  withCredentials: true,
});

// Response interceptor wrapper to trap server errors globally
api.interceptors.response.use(
  // If response is successful, pass it through directly
  (response) => response,
  // Catch request/response failures and bubble them back to caller
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
