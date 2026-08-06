import axios from 'axios';

/**
 * roadmapService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Client API service for communicating with /api/roadmap endpoints.
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
    const err = new Error(error.response.data.message);
    err.code = error.response.data.code;
    return err;
  }
  if (error.message) {
    return new Error(error.message);
  }
  return new Error('An unexpected API error occurred');
};

export const roadmapService = {
  /**
   * Generate a new AI career roadmap.
   * @param {Object} payload { careerGoal }
   */
  generateRoadmap: async (payload = {}) => {
    try {
      const response = await apiClient.post('/roadmap/generate', payload);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get latest generated roadmap & telemetry flags.
   */
  getLatestRoadmap: async () => {
    try {
      const response = await apiClient.get('/roadmap');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get history of generated roadmaps.
   */
  getRoadmapHistory: async () => {
    try {
      const response = await apiClient.get('/roadmap/history');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get roadmap details by ID.
   * @param {string} id Roadmap ID
   */
  getRoadmapById: async (id) => {
    try {
      const response = await apiClient.get(`/roadmap/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete a roadmap by ID.
   * @param {string} id Roadmap ID
   */
  deleteRoadmap: async (id) => {
    try {
      const response = await apiClient.delete(`/roadmap/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Mark a roadmap node as completed.
   * @param {string} nodeId Node ID or week number
   */
  markNodeComplete: async (nodeId) => {
    try {
      const response = await apiClient.patch(`/roadmap/node/${nodeId}/complete`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Mark a roadmap node as incomplete.
   * @param {string} nodeId Node ID or week number
   */
  markNodeReset: async (nodeId) => {
    try {
      const response = await apiClient.patch(`/roadmap/node/${nodeId}/reset`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get roadmap overall progress telemetry.
   */
  getRoadmapProgress: async () => {
    try {
      const response = await apiClient.get('/roadmap/progress');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

