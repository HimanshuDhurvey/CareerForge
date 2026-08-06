import axios from 'axios';

/**
 * dashboardService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Client API service for fetching aggregated dashboard data from GET /api/dashboard.
 */

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

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

const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.message) {
    return new Error(error.message);
  }
  return new Error('An unexpected API error occurred');
};

export const dashboardService = {
  /**
   * Fetch aggregated dashboard analytics & user widgets data.
   * Single backend request to GET /api/dashboard.
   */
  getDashboardData: async () => {
    try {
      const response = await apiClient.get('/dashboard');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
