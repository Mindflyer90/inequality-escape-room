import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import PuzzleGenerator from './services/PuzzleGenerator.js';
import SolutionValidator from './services/SolutionValidator.js';
import ClaudeService from './services/ClaudeService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const claudeService = new ClaudeService();
const puzzleGenerator = new PuzzleGenerator(claudeService);
const solutionValidator = new SolutionValidator();

// In-memory puzzle storage (for validation)
const puzzleStore = new Map();

// Middleware - Allow all origins for now
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes

// POST /api/puzzle/generate - Generate a new puzzle
app.post('/api/puzzle/generate', async (req, res, next) => {
  try {
    const { difficulty } = req.body;
    
    // Validate difficulty parameter
    const validDifficulties = ['easy', 'medium', 'hard'];
    const selectedDifficulty = difficulty || 'easy';
    
    if (!validDifficulties.includes(selectedDifficulty)) {
      const error = new Error('Difficoltà non valida. Usa: easy, medium, o hard');
      error.statusCode = 400;
      error.code = 'INVALID_DIFFICULTY';
      throw error;
    }
    
    // Generate puzzle (now async with Claude integration)
    const puzzle = await puzzleGenerator.generate(selectedDifficulty);
    
    // Store puzzle for validation
    puzzleStore.set(puzzle.id, puzzle);
    
    // Return puzzle data
    res.json(puzzle);
  } catch (error) {
    next(error);
  }
});

// POST /api/puzzle/validate - Validate a player's answer
app.post('/api/puzzle/validate', (req, res, next) => {
  try {
    const { puzzleId, answer } = req.body;
    
    // Validate required fields
    if (!puzzleId) {
      const error = new Error('puzzleId è richiesto');
      error.statusCode = 400;
      error.code = 'MISSING_PUZZLE_ID';
      throw error;
    }
    
    if (!answer) {
      const error = new Error('answer è richiesto');
      error.statusCode = 400;
      error.code = 'MISSING_ANSWER';
      throw error;
    }
    
    // Retrieve puzzle from store
    const puzzle = puzzleStore.get(puzzleId);
    
    if (!puzzle) {
      const error = new Error('Puzzle non trovato. Genera un nuovo puzzle.');
      error.statusCode = 404;
      error.code = 'PUZZLE_NOT_FOUND';
      throw error;
    }
    
    // Validate the answer
    const result = solutionValidator.validate(answer, puzzle.solution);
    
    // Return validation result with Italian message
    res.json({
      correct: result.correct,
      message: result.feedback
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/hint/generate - Generate a hint for a puzzle
app.post('/api/hint/generate', async (req, res, next) => {
  try {
    const { puzzleId, inequality, hintsUsed } = req.body;
    
    // Validate required fields
    if (!puzzleId) {
      const error = new Error('puzzleId è richiesto');
      error.statusCode = 400;
      error.code = 'MISSING_PUZZLE_ID';
      throw error;
    }
    
    if (!inequality) {
      const error = new Error('inequality è richiesto');
      error.statusCode = 400;
      error.code = 'MISSING_INEQUALITY';
      throw error;
    }
    
    if (hintsUsed === undefined || hintsUsed === null) {
      const error = new Error('hintsUsed è richiesto');
      error.statusCode = 400;
      error.code = 'MISSING_HINTS_USED';
      throw error;
    }
    
    // Enforce 3-hint limit
    const maxHints = 3;
    if (hintsUsed >= maxHints) {
      const error = new Error('Hai usato tutti gli indizi disponibili');
      error.statusCode = 400;
      error.code = 'MAX_HINTS_REACHED';
      throw error;
    }
    
    // Verify puzzle exists
    const puzzle = puzzleStore.get(puzzleId);
    if (!puzzle) {
      const error = new Error('Puzzle non trovato. Genera un nuovo puzzle.');
      error.statusCode = 404;
      error.code = 'PUZZLE_NOT_FOUND';
      throw error;
    }
    
    // Generate hint using Claude service
    const hint = await claudeService.generateHint(inequality, hintsUsed);
    
    // Calculate remaining hints
    const hintsRemaining = maxHints - (hintsUsed + 1);
    
    // Return hint with remaining count
    res.json({
      hint,
      hintsRemaining
    });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Si è verificato un errore interno del server';
  
  res.status(statusCode).json({
    error: true,
    message,
    code: err.code || 'INTERNAL_ERROR'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Endpoint non trovato',
    code: 'NOT_FOUND'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
