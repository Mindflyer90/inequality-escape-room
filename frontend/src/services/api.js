import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (optional, can be removed in production)
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 'Errore del server';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(new Error('Impossibile connettersi al server'));
    } else {
      // Something else happened
      return Promise.reject(new Error('Errore nella richiesta'));
    }
  }
);

/**
 * Generate a new puzzle
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Promise<Object>} Puzzle object with id, inequality, solution, etc.
 */
export const generatePuzzle = async (difficulty = 'easy') => {
  try {
    const response = await apiClient.post('/api/puzzle/generate', {
      difficulty,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Validate a solution for a puzzle
 * @param {string} puzzleId - The puzzle ID
 * @param {string} answer - The player's answer
 * @returns {Promise<Object>} Validation result with correct flag and message
 */
export const validateSolution = async (puzzleId, answer) => {
  try {
    const response = await apiClient.post('/api/puzzle/validate', {
      puzzleId,
      answer,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request a hint for the current puzzle
 * @param {string} puzzleId - The puzzle ID
 * @param {string} inequality - The inequality string
 * @param {number} hintsUsed - Number of hints already used
 * @returns {Promise<Object>} Hint object with hint text and remaining count
 */
export const requestHint = async (puzzleId, inequality, hintsUsed) => {
  try {
    const response = await apiClient.post('/api/hint/generate', {
      puzzleId,
      inequality,
      hintsUsed,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
