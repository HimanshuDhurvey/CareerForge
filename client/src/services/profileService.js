import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Reuse the same axios instance pattern from authService
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token on every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalise axios errors into a consistent shape
const handleApiError = (error) => {
  const customError = new Error();
  if (error.response?.data) {
    customError.message    = error.response.data.message || 'An error occurred';
    customError.errors     = error.response.data.errors  || [];
    customError.statusCode = error.response.status;
  } else {
    customError.message    = error.message || 'Network error, please try again';
    customError.errors     = [];
    customError.statusCode = 500;
  }
  return customError;
};

export const profileService = {
  /**
   * Fetches the authenticated user's profile from the backend.
   * Automatically creates a blank profile if one does not exist.
   * @returns {Promise<Object>} Profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/profile');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Updates the authenticated user's profile.
   * Email is read-only and will be rejected by the server if sent.
   * @param {Object} profileData
   * @returns {Promise<Object>} Updated profile data
   */
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/profile', profileData);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
