import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Dedicated Axios instance following authService pattern
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor attaching JWT token
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

// Standardized error handler
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

export const interviewService = {
  /**
   * POST /api/interviews/start
   * Start a new intelligent interview session.
   * @param {Object} payload - { role, difficulty, interviewType, numberOfQuestions, title }
   */
  startInterview: async (payload) => {
    try {
      const response = await apiClient.post('/interviews/start', payload);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * GET /api/interviews/:id/question
   * Fetch current question for an active session.
   * @param {string} interviewId
   */
  getCurrentQuestion: async (interviewId) => {
    try {
      const response = await apiClient.get(`/interviews/${interviewId}/question`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * POST /api/interviews/:id/answer
   * Submit candidate answer for a specific question.
   * @param {string} interviewId
   * @param {Object} answerData - { questionId, answer, timeTaken }
   */
  submitAnswer: async (interviewId, answerData) => {
    try {
      const response = await apiClient.post(`/interviews/${interviewId}/answer`, answerData);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * POST /api/interviews/:id/next
   * Advance to the next question in the session.
   * @param {string} interviewId
   */
  nextQuestion: async (interviewId) => {
    try {
      const response = await apiClient.post(`/interviews/${interviewId}/next`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * POST /api/interviews/:id/finish
   * Finish the interview session.
   * @param {string} interviewId
   */
  finishInterview: async (interviewId) => {
    try {
      const response = await apiClient.post(`/interviews/${interviewId}/finish`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * GET /api/interviews
   * Get user's interview history with pagination.
   * @param {Object} [params] - { page, limit }
   */
  getUserInterviews: async (params = {}) => {
    try {
      const response = await apiClient.get('/interviews', { params });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * GET /api/interviews/:id
   * Get complete interview session details (config, questions, answers).
   * @param {string} interviewId
   */
  getInterviewById: async (interviewId) => {
    try {
      const response = await apiClient.get(`/interviews/${interviewId}`);
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
