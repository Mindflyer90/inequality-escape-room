# Testing Checklist - Inequality Escape Room

## Test Environment
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## ✅ Backend API Tests (Automated)

All backend tests passed successfully:

1. ✅ Health check endpoint
2. ✅ Puzzle generation (POST /api/puzzle/generate)
3. ✅ Hint generation (POST /api/hint/generate)
4. ✅ Correct answer validation (POST /api/puzzle/validate)
5. ✅ Incorrect answer validation (POST /api/puzzle/validate)

## Frontend User Flow Tests (Manual Verification Required)

### 1. Initial Load
- [ ] Application loads without errors
- [ ] Game title "Escape Room delle Disequazioni" is displayed
- [ ] Subtitle "Risolvi le disequazioni per fuggire!" is visible
- [ ] Puzzle is automatically generated on load
- [ ] Loading spinner appears during puzzle generation

### 2. Escape Room Scene
- [ ] Door and lock visual elements are displayed
- [ ] Timer starts counting from 00:00
- [ ] Attempts counter shows 0
- [ ] Lock status indicator shows red (locked)
- [ ] Door appears closed with proper styling

### 3. Puzzle Display
- [ ] Inequality is displayed in large, readable font
- [ ] Difficulty badge shows correct level (Facile/Medio/Difficile)
- [ ] Puzzle reveal animation plays smoothly
- [ ] Mathematical notation is properly formatted

### 4. Answer Input
- [ ] Input field is visible and functional
- [ ] Placeholder text shows example format (es: x > 4)
- [ ] Submit button is enabled
- [ ] Input validation works (shows error for empty submission)

### 5. Hint System
- [ ] Hint panel shows "Indizi rimanenti: 3"
- [ ] "Richiedi Indizio" button is enabled
- [ ] Clicking hint button requests hint from API
- [ ] Hint appears with animation in the panel
- [ ] Hint counter decrements correctly
- [ ] After 3 hints, button becomes disabled
- [ ] Disabled state shows "Hai usato tutti gli indizi disponibili"

### 6. Answer Submission - Incorrect
- [ ] Submitting wrong answer shows validation
- [ ] Attempts counter increments
- [ ] Error message appears (if any)
- [ ] Input field remains active for retry
- [ ] No modal appears for incorrect answer

### 7. Answer Submission - Correct
- [ ] Submitting correct answer triggers success flow
- [ ] Lock animation plays (rotates and changes color)
- [ ] Door unlock animation plays
- [ ] Success particles/effects appear
- [ ] Feedback modal appears with animation
- [ ] Modal shows success icon with checkmark animation
- [ ] Success message in Italian is displayed
- [ ] Stats show attempts and hints used
- [ ] "Prossimo Puzzle" button is available
- [ ] "Nuovo Gioco" button is available

### 8. Feedback Modal
- [ ] Modal backdrop blurs background
- [ ] Modal scales in with spring animation
- [ ] Success icon pulses
- [ ] Checkmark draws with path animation
- [ ] Stats are displayed correctly
- [ ] Clicking "Prossimo Puzzle" loads new puzzle
- [ ] Clicking "Nuovo Gioco" resets and loads new puzzle
- [ ] Clicking backdrop closes modal

### 9. New Game Flow
- [ ] "Nuovo Gioco" button is visible during play
- [ ] Clicking button resets game state
- [ ] New puzzle is generated
- [ ] Timer resets to 00:00
- [ ] Attempts counter resets to 0
- [ ] Hints reset to 3 available
- [ ] Previous hints are cleared

### 10. Animations & Transitions
- [ ] Puzzle reveal animation (fade in + slide up)
- [ ] Card hover effects work smoothly
- [ ] Button hover effects (scale + shadow)
- [ ] Input focus effects (ring + shadow)
- [ ] Hint appear animation (slide from left)
- [ ] Success pulse animation on modal
- [ ] Lock unlock rotation animation
- [ ] Door opening animation (3D perspective)
- [ ] Particle effects on unlock
- [ ] Loading spinner animation

### 11. Responsive Design
- [ ] Layout works on desktop (1920x1080)
- [ ] Layout works on tablet (768px width)
- [ ] Layout works on mobile (375px width)
- [ ] Grid layout adjusts properly
- [ ] Text remains readable at all sizes
- [ ] Buttons are touch-friendly on mobile

### 12. Italian Localization
- [ ] All UI text is in Italian
- [ ] Error messages are in Italian
- [ ] Success messages are in Italian
- [ ] Hints are in Italian
- [ ] Button labels are in Italian
- [ ] No English text appears anywhere

### 13. Error Handling
- [ ] Network errors show user-friendly message
- [ ] API errors are handled gracefully
- [ ] Invalid input shows validation error
- [ ] Missing puzzle shows appropriate error
- [ ] Retry functionality works after errors

### 14. Performance
- [ ] Initial load is fast (< 2 seconds)
- [ ] Puzzle generation is quick (< 1 second)
- [ ] Hint requests complete quickly (< 3 seconds)
- [ ] Answer validation is instant (< 500ms)
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks during extended play

## Test Results Summary

### Automated Tests
✅ All backend API tests passed

### Manual Tests
⏳ Requires manual verification by opening http://localhost:5173

## Notes for Testing

1. **Backend must be running** on port 3000
2. **Frontend must be running** on port 5173
3. **ANTHROPIC_API_KEY** should be set in backend/.env for hint generation
4. Test with different difficulty levels (easy, medium, hard)
5. Test multiple puzzle generations to ensure variety
6. Test edge cases (very long inequalities, negative numbers)

## Known Limitations

- Hints require Claude API key to be configured
- Puzzle storage is in-memory (resets on server restart)
- No persistence of game progress
- No user authentication or profiles

## Recommendations

- Test on multiple browsers (Chrome, Firefox, Safari)
- Test with different screen sizes
- Test with keyboard navigation
- Test with screen readers for accessibility
- Monitor console for any warnings or errors
