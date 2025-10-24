import { motion } from 'framer-motion';
import locales from '../locales/it.json';

function PuzzleDisplay({ inequality, difficulty }) {
  const difficultyColors = {
    easy: 'bg-green-900/30 border-green-500 text-green-400',
    medium: 'bg-yellow-900/30 border-yellow-500 text-yellow-400',
    hard: 'bg-red-900/30 border-red-500 text-red-400',
  };

  const difficultyLabels = {
    easy: locales.difficulty.easy,
    medium: locales.difficulty.medium,
    hard: locales.difficulty.hard,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card puzzle-reveal card-hover"
    >
      {/* Difficulty Badge */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-300">
          {locales.puzzle.solve}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${
            difficultyColors[difficulty] || difficultyColors.easy
          }`}
        >
          {difficultyLabels[difficulty] || difficultyLabels.easy}
        </span>
      </div>

      {/* Inequality Display */}
      <div className="card-dark stone-texture">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2 text-shadow">{locales.puzzle.question}</p>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-4xl font-mono font-bold text-blue-400 tracking-wider glow-effect text-shadow-lg"
          >
            {inequality}
          </motion.div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-sm text-gray-400 text-center">
        <p>{locales.puzzle.yourAnswer}</p>
      </div>
    </motion.div>
  );
}

export default PuzzleDisplay;
