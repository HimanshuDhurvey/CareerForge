import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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

export const resumeService = {
  /**
   * Fetch the current user's resume metadata.
   * Returns null if no resume exists.
   */
  getResume: async () => {
    try {
      const res = await apiClient.get('/resume');
      return res.data.data; // null if no resume
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload a PDF file as the user's resume.
   * @param {File} file  Browser File object
   * @param {Function} onProgress  Optional upload progress callback (0-100)
   */
  uploadResume: async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await apiClient.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress
          ? (e) => onProgress(Math.round((e.loaded * 100) / e.total))
          : undefined,
      });
      return res.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete the current user's resume.
   */
  deleteResume: async () => {
    try {
      await apiClient.delete('/resume');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Trigger Gemini AI analysis on the uploaded resume.
   * Returns the created ResumeAnalysis doc.
   */
  analyzeResume: async () => {
    try {
      const res = await apiClient.post('/resume/analyze');
      return res.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Fetch the latest AI resume analysis report for the current user.
   */
  getLatestAnalysis: async () => {
    try {
      const res = await apiClient.get('/resume/analysis');
      return res.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Fetch previous resume analysis history for the current user (newest first).
   */
  getAnalysisHistory: async () => {
    try {
      const res = await apiClient.get('/resume/analysis/history');
      return res.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Build the URL to stream/preview the PDF in an iframe.
   * @param {string} filename  The stored filename from the resume doc
   */
  getFileUrl: (filename) => `${API_URL}/resume/file/${encodeURIComponent(filename)}`,

  /**
   * Format bytes into a human-readable string.
   * @param {number} bytes
   */
  formatFileSize: (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  },
};
