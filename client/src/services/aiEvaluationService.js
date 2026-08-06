import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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
  const customError = new Error();
  if (error.response && error.response.data) {
    customError.message = error.response.data.message || 'An error occurred';
    customError.status = error.response.data.statusCode || error.response.status;
    customError.errors = error.response.data.errors || [];
  } else if (error.request) {
    customError.message = 'Network error. Please check your internet connection or server status.';
    customError.status = 503;
  } else {
    customError.message = error.message || 'An unexpected error occurred.';
    customError.status = 500;
  }
  return customError.message;
};

/**
 * AI Evaluation Service
 * Communicates with backend /api/ai endpoints for Gemini AI interview reports.
 */
export const aiEvaluationService = {
  /**
   * Generate Gemini AI evaluation for a completed interview session.
   *
   * @param {string} interviewId
   * @returns {Promise<Object>} Evaluation data object
   */
  async evaluateInterview(interviewId) {
    try {
      const response = await apiClient.post(`/ai/evaluate/${interviewId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  /**
   * Fetch existing AI evaluation report for an interview session.
   *
   * @param {string} interviewId
   * @returns {Promise<Object>} Evaluation data object
   */
  async getEvaluation(interviewId) {
    try {
      const response = await apiClient.get(`/ai/evaluation/${interviewId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

export default aiEvaluationService;
