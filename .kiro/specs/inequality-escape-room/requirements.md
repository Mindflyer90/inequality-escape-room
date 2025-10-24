# Requirements Document

## Introduction

This document defines the requirements for an educational escape room web application focused on teaching first-degree (linear) inequalities. The application combines gamification with mathematical learning, presenting inequality puzzles in an engaging escape-room format. The system must be lightweight, easily deployable on modern platforms (Vercel, Railway, Render), and fully localized in Italian.

## Glossary

- **Application**: The complete web-based escape room system including frontend and backend components
- **Puzzle Generator**: The backend component that creates random linear inequality problems
- **Player**: The end user interacting with the escape room to solve inequality puzzles
- **Claude API**: Anthropic's AI service used for generating puzzle content and hints
- **Solution Validator**: The component that verifies whether a player's answer is mathematically correct
- **Escape Room Interface**: The frontend user interface styled as an escape room experience
- **Linear Inequality**: A first-degree mathematical inequality (e.g., 2x + 3 > 7)

## Requirements

### Requirement 1

**User Story:** As a player, I want to see randomly generated linear inequality puzzles, so that I can practice solving different types of problems each time I play.

#### Acceptance Criteria

1. WHEN the Player starts a new game session, THE Puzzle Generator SHALL create a unique first-degree inequality problem
2. THE Puzzle Generator SHALL generate inequalities with integer coefficients between -10 and 10 (excluding zero)
3. THE Puzzle Generator SHALL support all four inequality operators (>, <, ≥, ≤)
4. THE Puzzle Generator SHALL ensure each generated puzzle has exactly one variable (x)
5. THE Application SHALL display the generated inequality in Italian mathematical notation

### Requirement 2

**User Story:** As a player, I want to receive hints and clues when I'm stuck, so that I can learn the solving process without getting frustrated.

#### Acceptance Criteria

1. WHEN the Player requests a hint, THE Application SHALL invoke the Claude API to generate a contextual clue
2. THE Application SHALL provide hints in Italian language
3. THE Application SHALL generate step-by-step guidance that explains the solving methodology
4. THE Application SHALL limit hints to three per puzzle to maintain challenge level
5. WHEN the Player has used all available hints, THE Application SHALL display a message indicating no more hints are available

### Requirement 3

**User Story:** As a player, I want to submit my solution and receive immediate feedback, so that I know whether I solved the inequality correctly.

#### Acceptance Criteria

1. WHEN the Player submits a solution, THE Solution Validator SHALL verify the mathematical correctness within 2 seconds
2. THE Solution Validator SHALL accept solutions in interval notation or inequality form
3. WHEN the solution is correct, THE Application SHALL display a success message in Italian
4. WHEN the solution is incorrect, THE Application SHALL display an error message in Italian without revealing the correct answer
5. THE Application SHALL allow the Player to retry after an incorrect submission

### Requirement 4

**User Story:** As a player, I want an engaging escape-room themed interface, so that learning feels like playing a game rather than studying.

#### Acceptance Criteria

1. THE Escape Room Interface SHALL use React components with Tailwind CSS styling
2. THE Escape Room Interface SHALL include animations for puzzle reveals and solution feedback
3. THE Escape Room Interface SHALL display all text content in Italian language
4. THE Escape Room Interface SHALL use thematic visual elements (locks, keys, doors, timers)
5. THE Escape Room Interface SHALL be responsive and functional on mobile and desktop devices

### Requirement 5

**User Story:** As a developer, I want a lightweight backend architecture, so that the application is easy to deploy and maintain on serverless platforms.

#### Acceptance Criteria

1. THE Application SHALL use a backend framework with minimal dependencies
2. THE Application SHALL communicate with the Claude API using official Anthropic SDK
3. THE Application SHALL expose RESTful API endpoints for puzzle generation, hint requests, and solution validation
4. THE Application SHALL store the Claude API key securely using environment variables
5. THE Application SHALL be deployable on Vercel, Railway, or Render without additional infrastructure

### Requirement 6

**User Story:** As a content creator, I want the ability to easily adapt puzzles and themes, so that I can customize the escape room for different educational contexts.

#### Acceptance Criteria

1. THE Application SHALL store puzzle configuration in a separate JSON or YAML file
2. THE Application SHALL allow modification of difficulty parameters without code changes
3. THE Application SHALL support theming through CSS variables or configuration files
4. THE Application SHALL provide clear documentation for customizing puzzle types
5. THE Application SHALL separate content strings into a localization file for easy translation

### Requirement 7

**User Story:** As a player, I want to see multiple answer options for some puzzles, so that I can select the correct solution even if I'm not confident in my calculation.

#### Acceptance Criteria

1. WHERE the puzzle includes multiple choice options, THE Puzzle Generator SHALL create three incorrect distractors alongside the correct answer
2. WHERE the puzzle includes multiple choice options, THE Application SHALL randomize the position of the correct answer
3. WHERE the puzzle includes multiple choice options, THE Application SHALL display all options in Italian
4. THE Application SHALL support both free-form input and multiple-choice answer formats
5. WHEN the Player selects a multiple-choice answer, THE Solution Validator SHALL verify the selection immediately
