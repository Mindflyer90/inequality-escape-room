# Design Document - Inequality Escape Room

## Overview

The Inequality Escape Room is a full-stack web application that gamifies learning linear inequalities through an escape room experience. The architecture follows a client-server model with a React frontend and a lightweight Node.js backend that interfaces with Claude API for intelligent hint generation.

The application prioritizes simplicity, deployability, and maintainability while delivering an engaging educational experience entirely in Italian.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│  - Escape Room UI (Tailwind + Framer)   │
│  - Game State Management (Zustand)      │
│  - Italian Localization                 │
└──────────────────┬──────────────────────┘
                   │ HTTP/REST
                   │
┌──────────────────▼──────────────────────┐
│      Backend (Express.js/Fastify)       │
│  - Puzzle Generation Logic              │
│  - Solution Validation                  │
│  - Claude API Integration               │
└──────────────────┬──────────────────────┘
                   │
                   │
┌──────────────────▼──────────────────────┐
│         Claude API (Anthropic)          │
│  - Hint Generation                      │
│  - Educational Explanations             │
└─────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 with Vite for fast development and builds
- Tailwind CSS for styling
- Framer Motion for animations
- Zustand for lightweight state management
- Axios for API communication

**Backend:**
- Node.js with Express.js (lightweight, widely supported)
- Anthropic SDK (@anthropic-ai/sdk) for Claude integration
- dotenv for environment configuration
- CORS enabled for frontend communication

**Deployment:**
- Frontend: Vercel (optimized for React/Vite)
- Backend: Railway or Render (Node.js support with env vars)
- Environment variables for API keys and configuration

## Components and Interfaces

### Frontend Components

#### 1. Game Container (`GameContainer.jsx`)
Main orchestrator component that manages game flow and state.

```typescript
interface GameState {
  currentPuzzle: Puzzle | null;
  hintsUsed: number;
  isLoading: boolean;
  gameStatus: 'idle' | 'playing' | 'solved' | 'failed';
}
```

#### 2. Escape Room Scene (`EscapeRoomScene.jsx`)
Visual container with escape room theming (door, lock, timer animations).

Props:
- `isLocked: boolean` - Controls door lock animation
- `onUnlock: () => void` - Callback when puzzle is solved

#### 3. Puzzle Display (`PuzzleDisplay.jsx`)
Renders the inequality puzzle with proper mathematical notation.

```typescript
interface PuzzleDisplayProps {
  inequality: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
```

#### 4. Answer Input (`AnswerInput.jsx`)
Handles both free-form and multiple-choice answer submission.

```typescript
interface AnswerInputProps {
  mode: 'freeform' | 'multiple-choice';
  options?: string[];
  onSubmit: (answer: string) => void;
}
```

#### 5. Hint Panel (`HintPanel.jsx`)
Displays hints and manages hint request flow.

```typescript
interface HintPanelProps {
  hintsRemaining: number;
  currentHints: string[];
  onRequestHint: () => void;
}
```

#### 6. Feedback Modal (`FeedbackModal.jsx`)
Shows success/failure messages with animations.

### Backend API Endpoints

#### POST `/api/puzzle/generate`
Generates a new linear inequality puzzle.

**Request:**
```json
{
  "difficulty": "easy" | "medium" | "hard"
}
```

**Response:**
```json
{
  "id": "uuid",
  "inequality": "2x + 5 > 13",
  "solution": "x > 4",
  "mode": "freeform",
  "options": null,
  "difficulty": "easy"
}
```

#### POST `/api/puzzle/validate`
Validates a player's solution.

**Request:**
```json
{
  "puzzleId": "uuid",
  "answer": "x > 4"
}
```

**Response:**
```json
{
  "correct": true,
  "message": "Corretto! Hai risolto il puzzle!"
}
```

#### POST `/api/hint/generate`
Requests a hint from Claude API.

**Request:**
```json
{
  "puzzleId": "uuid",
  "inequality": "2x + 5 > 13",
  "hintsUsed": 1
}
```

**Response:**
```json
{
  "hint": "Inizia sottraendo 5 da entrambi i lati della disequazione.",
  "hintsRemaining": 2
}
```

### Backend Services

#### PuzzleGenerator Service
Generates random linear inequalities with configurable difficulty.

```javascript
class PuzzleGenerator {
  generate(difficulty) {
    // Returns: { inequality, solution, steps }
  }
  
  generateMultipleChoice(puzzle) {
    // Returns: { correctAnswer, distractors }
  }
}
```

**Algorithm:**
1. Generate random coefficients based on difficulty
2. Select random inequality operator
3. Construct inequality string
4. Calculate correct solution
5. Generate distractors for multiple-choice mode

#### SolutionValidator Service
Validates player answers against correct solutions.

```javascript
class SolutionValidator {
  validate(playerAnswer, correctSolution) {
    // Parses and compares mathematical expressions
    // Returns: { correct: boolean, feedback: string }
  }
  
  parseAnswer(answer) {
    // Handles interval notation and inequality form
  }
}
```

#### ClaudeService
Interfaces with Anthropic API for hint generation.

```javascript
class ClaudeService {
  async generateHint(inequality, hintsUsed) {
    // Calls Claude API with Italian prompt
    // Returns progressive hints based on hintsUsed count
  }
}
```

**Prompt Strategy:**
- Hint 1: General approach (isolate variable)
- Hint 2: First step with explanation
- Hint 3: Detailed step-by-step solution

## Data Models

### Puzzle Model
```typescript
interface Puzzle {
  id: string;
  inequality: string;        // "2x + 5 > 13"
  solution: string;          // "x > 4"
  solutionSteps: string[];   // ["2x > 8", "x > 4"]
  difficulty: 'easy' | 'medium' | 'hard';
  mode: 'freeform' | 'multiple-choice';
  options?: string[];        // For multiple-choice mode
  createdAt: Date;
}
```

### Game Session Model (Frontend State)
```typescript
interface GameSession {
  puzzleId: string;
  startTime: Date;
  hintsUsed: number;
  attempts: number;
  completed: boolean;
}
```

### Configuration Model
```typescript
interface PuzzleConfig {
  difficulty: {
    easy: { minCoeff: number; maxCoeff: number; };
    medium: { minCoeff: number; maxCoeff: number; };
    hard: { minCoeff: number; maxCoeff: number; };
  };
  maxHints: number;
  operators: string[];
}
```

Stored in `config/puzzle-config.json`:
```json
{
  "difficulty": {
    "easy": { "minCoeff": 1, "maxCoeff": 5 },
    "medium": { "minCoeff": 1, "maxCoeff": 10 },
    "hard": { "minCoeff": -10, "maxCoeff": 10 }
  },
  "maxHints": 3,
  "operators": [">", "<", "≥", "≤"]
}
```

## Error Handling

### Frontend Error Handling

1. **API Communication Errors**
   - Display user-friendly Italian error messages
   - Retry mechanism for transient failures
   - Fallback UI when backend is unavailable

2. **Invalid Input Handling**
   - Client-side validation before submission
   - Clear error messages for malformed answers
   - Input sanitization

3. **Loading States**
   - Skeleton loaders during API calls
   - Timeout handling (10 second max)
   - Graceful degradation

### Backend Error Handling

1. **Claude API Failures**
   - Fallback to pre-written hints if API fails
   - Retry logic with exponential backoff
   - Error logging for monitoring

2. **Validation Errors**
   - Return 400 with descriptive error messages
   - Handle edge cases (division by zero, invalid operators)

3. **Rate Limiting**
   - Implement basic rate limiting per IP
   - Return 429 with retry-after header

**Error Response Format:**
```json
{
  "error": true,
  "message": "Messaggio di errore in italiano",
  "code": "ERROR_CODE"
}
```

## Testing Strategy

### Frontend Testing

1. **Component Tests (Vitest + React Testing Library)**
   - Test puzzle display rendering
   - Test answer input validation
   - Test hint panel state management
   - Test feedback modal animations

2. **Integration Tests**
   - Test complete game flow (start → hint → solve)
   - Test API integration with mocked responses
   - Test error handling scenarios

3. **Visual Testing**
   - Manual testing of escape room animations
   - Responsive design testing (mobile/desktop)
   - Cross-browser compatibility (Chrome, Firefox, Safari)

### Backend Testing

1. **Unit Tests (Jest)**
   - PuzzleGenerator: Test inequality generation logic
   - SolutionValidator: Test answer parsing and validation
   - Test edge cases (negative numbers, zero coefficients)

2. **API Tests**
   - Test all endpoints with valid/invalid inputs
   - Test Claude API integration with mocked responses
   - Test error handling and status codes

3. **End-to-End Tests**
   - Test complete puzzle lifecycle
   - Test hint generation flow
   - Test solution validation accuracy

### Deployment Testing

1. **Pre-deployment Checklist**
   - Verify environment variables are set
   - Test API connectivity in staging
   - Verify Italian localization is complete

2. **Post-deployment Verification**
   - Smoke test all API endpoints
   - Verify frontend loads correctly
   - Test one complete game session

## Localization Strategy

All Italian text will be stored in `frontend/src/locales/it.json`:

```json
{
  "game": {
    "title": "Escape Room delle Disequazioni",
    "start": "Inizia il Gioco",
    "hint": "Richiedi Indizio",
    "submit": "Invia Risposta"
  },
  "feedback": {
    "correct": "Corretto! Hai risolto il puzzle!",
    "incorrect": "Non è corretto. Riprova!",
    "noHints": "Hai usato tutti gli indizi disponibili."
  },
  "puzzle": {
    "solve": "Risolvi la disequazione:",
    "hintsRemaining": "Indizi rimanenti: {count}"
  }
}
```

Backend prompts for Claude will also be in Italian to ensure consistent language in hints.

## Deployment Configuration

### Frontend (Vercel)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://api.inequality-escape.com"
  }
}
```

### Backend (Railway/Render)
```yaml
services:
  - type: web
    name: inequality-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
```

## Security Considerations

1. **API Key Protection**
   - Never expose Claude API key in frontend
   - Use environment variables
   - Implement backend proxy for all AI requests

2. **Input Sanitization**
   - Validate all user inputs on backend
   - Prevent injection attacks in mathematical expressions

3. **Rate Limiting**
   - Limit puzzle generation requests per IP
   - Limit hint requests to prevent API abuse

4. **CORS Configuration**
   - Whitelist only production frontend domain
   - Disable in development for localhost
