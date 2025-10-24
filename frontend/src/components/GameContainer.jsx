import { useEffect, useState } from 'react';
import useGameStore from '../store/gameStore';
import PuzzleDisplay from './PuzzleDisplay';
import AnswerInput from './AnswerInput';
import HintPanel from './HintPanel';
import FeedbackModal from './FeedbackModal';
import EscapeRoomScene from './EscapeRoomScene';
import locales from '../locales/it.json';

function GameContainer() {
  const {
    currentPuzzle,
    gameStatus,
    isLoading,
    error,
    attempts,
    loadPuzzle,
    resetGame,
    clearError,
  } = useGameStore();

  // Track start time for timer
  const [startTime, setStartTime] = useState(null);

  // Load initial puzzle when component mounts
  useEffect(() => {
    if (gameStatus === 'idle') {
      loadPuzzle('easy');
      setStartTime(Date.now());
    }
  }, [gameStatus, loadPuzzle]);

  // Update start time when a new puzzle is loaded
  useEffect(() => {
    if (gameStatus === 'playing' && currentPuzzle) {
      setStartTime(Date.now());
    }
  }, [currentPuzzle, gameStatus]);

  const handleNewGame = (difficulty = 'easy') => {
    resetGame();
    loadPuzzle(difficulty);
    setStartTime(Date.now());
  };

  const handleContinue = () => {
    const difficulty = currentPuzzle?.difficulty || 'easy';
    resetGame();
    loadPuzzle(difficulty);
    setStartTime(Date.now());
  };

  // Loading state
  if (isLoading && !currentPuzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">{locales.game.loading}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !currentPuzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-md">
          <p className="text-xl text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              loadPuzzle('easy');
              setStartTime(Date.now());
            }}
            className="btn-primary"
          >
            {locales.puzzle.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Game Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-shadow-lg">{locales.game.title}</h1>
        <p className="text-gray-400 text-shadow">{locales.game.subtitle}</p>
      </div>

      {/* Escape Room Scene - Always visible when puzzle exists */}
      {currentPuzzle && (
        <div className="mb-8">
          <EscapeRoomScene
            isLocked={gameStatus !== 'solved'}
            onUnlock={() => {}}
            attempts={attempts}
            startTime={startTime}
          />
        </div>
      )}

      {/* Main Game Area - Only visible during play */}
      {currentPuzzle && gameStatus === 'playing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Puzzle and Answer */}
          <div className="lg:col-span-2 space-y-6">
            <PuzzleDisplay
              inequality={currentPuzzle.inequality}
              difficulty={currentPuzzle.difficulty}
            />
            <AnswerInput
              mode={currentPuzzle.mode}
              options={currentPuzzle.options}
            />
          </div>

          {/* Right Column - Hints */}
          <div className="lg:col-span-1">
            <HintPanel />
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal onContinue={handleContinue} onNewGame={handleNewGame} />

      {/* New Game Button */}
      {gameStatus === 'playing' && currentPuzzle && (
        <div className="mt-8 text-center">
          <button
            onClick={() => handleNewGame(currentPuzzle.difficulty)}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            {locales.game.newGame}
          </button>
        </div>
      )}
    </div>
  );
}

export default GameContainer;
