import { create } from 'zustand';
import { generatePuzzle, validateSolution, requestHint } from '../services/api';
import locales from '../locales/it.json';

const useGameStore = create((set, get) => ({
  // State
  currentPuzzle: null,
  hintsUsed: 0,
  hints: [],
  isLoading: false,
  gameStatus: 'idle', // 'idle' | 'playing' | 'solved' | 'failed'
  error: null,
  attempts: 0,

  // Actions
  loadPuzzle: async (difficulty = 'easy') => {
    set({ isLoading: true, error: null });
    try {
      const puzzle = await generatePuzzle(difficulty);
      set({
        currentPuzzle: puzzle,
        hintsUsed: 0,
        hints: [],
        gameStatus: 'playing',
        isLoading: false,
        attempts: 0,
      });
    } catch (error) {
      set({
        error: error.message || locales.errors.loadFailed,
        isLoading: false,
      });
    }
  },

  requestHint: async () => {
    const { currentPuzzle, hintsUsed } = get();
    
    if (!currentPuzzle) {
      set({ error: locales.errors.puzzleNotFound });
      return;
    }

    if (hintsUsed >= 3) {
      set({ error: locales.errors.maxHintsReached });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await requestHint(
        currentPuzzle.id,
        currentPuzzle.inequality,
        hintsUsed
      );
      
      set((state) => ({
        hints: [...state.hints, response.hint],
        hintsUsed: state.hintsUsed + 1,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.message || locales.errors.apiError,
        isLoading: false,
      });
    }
  },

  submitAnswer: async (answer) => {
    const { currentPuzzle, attempts } = get();
    
    if (!currentPuzzle) {
      set({ error: locales.errors.puzzleNotFound });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const result = await validateSolution(currentPuzzle.id, answer);
      
      set({
        gameStatus: result.correct ? 'solved' : 'playing',
        attempts: attempts + 1,
        isLoading: false,
        error: result.correct ? null : result.message,
      });

      return result;
    } catch (error) {
      set({
        error: error.message || locales.errors.serverError,
        isLoading: false,
      });
      return { correct: false, message: error.message };
    }
  },

  resetGame: () => {
    set({
      currentPuzzle: null,
      hintsUsed: 0,
      hints: [],
      gameStatus: 'idle',
      error: null,
      attempts: 0,
      isLoading: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useGameStore;
