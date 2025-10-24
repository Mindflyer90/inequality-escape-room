import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import locales from '../locales/it.json';

function HintPanel() {
  const { hints, hintsUsed, isLoading, requestHint } = useGameStore();
  
  const maxHints = 3;
  const hintsRemaining = maxHints - hintsUsed;
  const canRequestHint = hintsRemaining > 0 && !isLoading;

  const handleRequestHint = () => {
    if (canRequestHint) {
      requestHint();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card card-hover h-fit"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-300">
          {locales.hints.title}
        </h3>
        <span className="text-sm text-gray-400">
          {locales.hints.remaining.replace('{count}', hintsRemaining)}
        </span>
      </div>

      {/* Hints List */}
      <div className="space-y-3 mb-4 min-h-[200px]">
        <AnimatePresence>
          {hints.length > 0 ? (
            hints.map((hint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="card-dark hint-appear"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-300 leading-relaxed">{hint}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-500 text-center">
              <p className="text-sm">
                {locales.hints.empty}
                <br />
                {locales.hints.emptyHelp}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Request Hint Button */}
      <motion.button
        onClick={handleRequestHint}
        disabled={!canRequestHint}
        whileHover={canRequestHint ? { scale: 1.02 } : {}}
        whileTap={canRequestHint ? { scale: 0.98 } : {}}
        className={`w-full ${canRequestHint ? 'btn-secondary' : 'bg-gray-700 text-gray-500 cursor-not-allowed px-4 py-3 rounded-lg font-semibold transition-all shadow-lg'}`}
      >
        {isLoading
          ? locales.hints.requesting
          : hintsRemaining > 0
          ? locales.hints.request
          : locales.hints.noHints}
      </motion.button>

      {/* Hints Used Counter */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {locales.hints.used.replace('{count}', hintsUsed).replace('{max}', maxHints)}
        </p>
      </div>
    </motion.div>
  );
}

export default HintPanel;
