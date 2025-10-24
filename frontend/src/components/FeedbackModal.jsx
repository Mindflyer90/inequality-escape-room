import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import locales from '../locales/it.json';

function FeedbackModal({ onContinue, onNewGame }) {
  const { gameStatus, attempts, hintsUsed } = useGameStore();
  
  const isVisible = gameStatus === 'solved';

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={onContinue}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-green-500 shadow-2xl success-pulse">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-6"
              >
                <h2 className="text-3xl font-bold text-green-400 mb-2">
                  {locales.feedback.excellent}
                </h2>
                <p className="text-xl text-gray-300 mb-4">
                  {locales.feedback.correct}
                </p>
                <p className="text-lg text-green-300">
                  {locales.feedback.escaped}
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="card-dark mb-6 space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tentativi:</span>
                  <span className="text-white font-semibold">{attempts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Indizi usati:</span>
                  <span className="text-white font-semibold">{hintsUsed} / 3</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <button
                  onClick={onContinue}
                  className="btn-success w-full"
                >
                  {locales.puzzle.nextPuzzle}
                </button>
                <button
                  onClick={() => onNewGame('easy')}
                  className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 
                    text-white font-semibold rounded-lg transition-colors"
                >
                  {locales.game.newGame}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default FeedbackModal;
