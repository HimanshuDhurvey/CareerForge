import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create a dedicated Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Necessary to send cookies for HTTP-only cookie auth fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to headers if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to extract errors from backend response
const handleApiError = (error) => {
  const customError = new Error();
  if (error.response && error.response.data) {
    customError.message = error.response.data.message || 'An error occurred';
    customError.errors = error.response.data.errors || [];
    customError.statusCode = error.response.status;
  } else {
    customError.message = error.message || 'Network error, please try again';
    customError.errors = [];
    customError.statusCode = 500;
  }
  return customError;
};

export const authService = {
  /**
   * Logs in a user.
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<Object>}
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { user, accessToken } = response.data.data;

      // Store credentials securely in localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        success: true,
        user,
        token: accessToken,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Registers a user. Maps frontend 'name' to backend 'fullName'.
   * @param {Object} userData
   * @param {string} userData.name
   * @param {string} userData.email
   * @param {string} userData.password
   * @returns {Promise<Object>}
   */
  register: async (userData) => {
    try {
      const payload = {
        fullName: userData.name,
        email: userData.email,
        password: userData.password,
      };
      const response = await apiClient.post('/auth/register', payload);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Logs out the user on backend and clears client storage.
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Best effort call to notify the backend
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Backend logout failed:', error);
    } finally {
      // Always clear local session credentials
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Fetches the current user profile from backend.
   * @returns {Promise<Object>}
   */
  getMe: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      const { user } = response.data.data;

      // Update current user info in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      // Clear invalid/expired credentials
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw handleApiError(error);
    }
  },

  /**
   * Retrieves the currently logged in user from localStorage.
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Failed to read user from localStorage:', e);
      return null;
    }
  },

  /**
   * Checks if user session is active by looking for a token.
   * @returns {boolean}
   */
  isAuthenticated: () => {
    try {
      return !!localStorage.getItem('token');
    } catch {
      return false;
    }
  },
};
