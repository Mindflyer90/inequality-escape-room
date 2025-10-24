# Implementation Plan

- [x] 1. Initialize project structure and dependencies
  - Create monorepo structure with frontend and backend directories
  - Initialize frontend with Vite + React + Tailwind CSS
  - Initialize backend with Express.js and required dependencies
  - Set up package.json scripts for development and build
  - Create .env.example files for both frontend and backend
  - _Requirements: 5.1, 5.5_

- [x] 2. Implement backend puzzle generation service
  - [x] 2.1 Create PuzzleGenerator class with inequality generation logic
    - Implement coefficient generation based on difficulty levels
    - Implement random operator selection (>, <, ≥, ≤)
    - Implement solution calculation algorithm
    - Create puzzle configuration loader from JSON file
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 2.2 Create puzzle configuration file
    - Define difficulty parameters in config/puzzle-config.json
    - Include coefficient ranges for easy, medium, hard difficulties
    - Define max hints and available operators
    - _Requirements: 6.1, 6.2_
  
  - [x] 2.3 Implement multiple-choice option generator
    - Create distractor generation logic for incorrect answers
    - Implement answer randomization
    - _Requirements: 7.1, 7.2_
  
  - [ ]* 2.4 Write unit tests for PuzzleGenerator
    - Test inequality generation for all difficulty levels
    - Test solution calculation accuracy
    - Test multiple-choice distractor generation
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 3. Implement backend solution validation service
  - [x] 3.1 Create SolutionValidator class
    - Implement answer parsing for interval notation
    - Implement answer parsing for inequality form
    - Implement mathematical comparison logic
    - Handle edge cases (negative numbers, fractions)
    - _Requirements: 3.1, 3.2_
  
  - [ ]* 3.2 Write unit tests for SolutionValidator
    - Test validation with correct answers
    - Test validation with incorrect answers
    - Test parsing of different answer formats
    - _Requirements: 3.1, 3.2_

- [x] 4. Implement Claude API integration for hints
  - [x] 4.1 Create ClaudeService class
    - Implement hint generation method with Italian prompts
    - Implement progressive hint logic (3 levels)
    - Add error handling and fallback hints
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 4.2 Create fallback hint system
    - Define pre-written Italian hints for common puzzle types
    - Implement fallback logic when Claude API fails
    - _Requirements: 2.1, 2.2_

- [x] 5. Implement backend API endpoints
  - [x] 5.1 Create Express.js server setup
    - Configure Express app with CORS
    - Set up environment variable loading
    - Configure JSON body parsing
    - Add basic error handling middleware
    - _Requirements: 5.1, 5.3_
  
  - [x] 5.2 Implement POST /api/puzzle/generate endpoint
    - Accept difficulty parameter
    - Call PuzzleGenerator service
    - Return puzzle data with unique ID
    - Add input validation
    - _Requirements: 1.1, 5.3_
  
  - [x] 5.3 Implement POST /api/puzzle/validate endpoint
    - Accept puzzleId and answer
    - Call SolutionValidator service
    - Return validation result with Italian message
    - _Requirements: 3.1, 3.3, 3.4, 3.5_
  
  - [x] 5.4 Implement POST /api/hint/generate endpoint
    - Accept puzzleId, inequality, and hintsUsed count
    - Call ClaudeService for hint generation
    - Enforce 3-hint limit
    - Return hint with remaining count
    - _Requirements: 2.1, 2.2, 2.4, 2.5_
  
  - [ ]* 5.5 Write API integration tests
    - Test all endpoints with valid inputs
    - Test error handling with invalid inputs
    - Test rate limiting behavior
    - _Requirements: 5.3_

- [x] 6. Create Italian localization file
  - Create frontend/src/locales/it.json with all game text
  - Include UI labels, feedback messages, and instructions
  - Add puzzle-related terminology
  - _Requirements: 1.5, 2.2, 3.3, 3.4, 4.3, 6.5_

- [x] 7. Implement frontend state management
  - [x] 7.1 Set up Zustand store
    - Install Zustand dependency
    - Create game state store with puzzle, hints, and status
    - Implement actions for puzzle loading, hint requests, and answer submission
    - _Requirements: 1.1, 2.1, 3.1_
  
  - [x] 7.2 Create API client service
    - Install Axios
    - Create API client with base URL configuration
    - Implement methods for all backend endpoints
    - Add error handling and timeout configuration
    - _Requirements: 5.3_

- [x] 8. Implement core frontend components
  - [x] 8.1 Create GameContainer component
    - Implement game flow orchestration
    - Connect to Zustand store
    - Handle loading states
    - Manage game status transitions
    - _Requirements: 1.1, 3.1_
  
  - [x] 8.2 Create PuzzleDisplay component
    - Render inequality with proper mathematical notation
    - Display difficulty indicator
    - Style with Tailwind CSS
    - _Requirements: 1.5, 4.3_
  
  - [x] 8.3 Create AnswerInput component
    - Implement free-form text input
    - Implement multiple-choice selection
    - Add input validation
    - Connect submit handler to store
    - _Requirements: 3.1, 3.2, 7.1, 7.2_
  
  - [x] 8.4 Create HintPanel component
    - Display hints list
    - Show remaining hints count
    - Implement hint request button
    - Disable button when no hints remain
    - _Requirements: 2.1, 2.4, 2.5_
  
  - [x] 8.5 Create FeedbackModal component
    - Implement success/failure modal
    - Add Framer Motion animations
    - Display Italian feedback messages
    - _Requirements: 3.3, 3.4, 4.2_
  
  - [ ]* 8.6 Write component tests
    - Test PuzzleDisplay rendering
    - Test AnswerInput validation
    - Test HintPanel state management
    - Test FeedbackModal animations
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 9. Implement escape room themed UI
  - [x] 9.1 Create EscapeRoomScene component
    - Design door/lock visual elements with Tailwind
    - Implement unlock animation with Framer Motion
    - Add timer display
    - Create responsive layout
    - _Requirements: 4.1, 4.2, 4.4, 4.5_
  
  - [x] 9.2 Add theme styling and animations
    - Create CSS variables for theming
    - Implement puzzle reveal animations
    - Add success/failure transition effects
    - Style all components with escape room aesthetic
    - _Requirements: 4.1, 4.2, 6.3_
  
  - [x] 9.3 Integrate localization throughout UI
    - Import Italian locale file
    - Replace all hardcoded text with locale strings
    - Verify all UI text is in Italian
    - _Requirements: 4.3, 6.5_

- [ ] 10. Wire all components together
  - [x] 10.1 Integrate components in GameContainer
    - Compose EscapeRoomScene, PuzzleDisplay, AnswerInput, HintPanel
    - Connect all event handlers to store actions
    - Implement complete game flow (start → play → solve)
    - _Requirements: 1.1, 2.1, 3.1_
  
  - [x] 10.2 Create main App component
    - Set up routing if needed
    - Add global styles and Tailwind configuration
    - Configure API base URL from environment
    - _Requirements: 4.1, 4.5_
  
  - [x] 10.3 Test complete user flow
    - Verify puzzle generation works end-to-end
    - Test hint request and display
    - Test answer submission and validation
    - Verify all animations and transitions
    - _Requirements: 1.1, 2.1, 3.1_

- [x] 11. Prepare deployment configuration
  - [x] 11.1 Create Vercel configuration for frontend
    - Create vercel.json with build settings
    - Configure environment variables
    - Set up build command and output directory
    - _Requirements: 5.5_
  
  - [x] 11.2 Create Railway/Render configuration for backend
    - Create railway.json or render.yaml
    - Configure environment variables (ANTHROPIC_API_KEY)
    - Set up start command and health check
    - _Requirements: 5.4, 5.5_
  
  - [x] 11.3 Create deployment documentation
    - Write README with deployment instructions
    - Document environment variable requirements
    - Include customization guide for puzzles and themes
    - _Requirements: 6.4, 6.5_
