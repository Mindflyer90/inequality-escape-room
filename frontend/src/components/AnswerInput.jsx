import { useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import locales from '../locales/it.json';

function AnswerInput({ mode, options }) {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [validationError, setValidationError] = useState('');
  
  const { submitAnswer, isLoading } = useGameStore();

  const validateAnswer = (value) => {
    if (!value || value.trim() === '') {
      return locales.validation.answerRequired;
    }
    
    // Basic format validation for free-form input
    if (mode === 'freeform') {
      // Check if answer contains x and an operator
      const hasVariable = /x/.test(value);
      const hasOperator = /[><≥≤=]/.test(value);
      
      if (!hasVariable || !hasOperator) {
        return locales.validation.invalidFormat;
      }
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const answerToSubmit = mode === 'multiple-choice' ? selectedOption : answer;
    
    // Validate
    const error = validateAnswer(answerToSubmit);
    if (error) {
      setValidationError(error);
      return;
    }
    
    setValidationError('');
    
    // Submit answer
    await submitAnswer(answerToSubmit);
    
    // Clear input after submission
    if (mode === 'freeform') {
      setAnswer('');
    }
  };

  const handleInputChange = (e) => {
    setAnswer(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card card-hover"
    >
      <form onSubmit={handleSubmit}>
        {mode === 'freeform' ? (
          // Free-form text input
          <div className="space-y-4">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-300">
              {locales.puzzle.enterAnswer}
            </label>
            <input
              id="answer"
              type="text"
              value={answer}
              onChange={handleInputChange}
              placeholder="es: x > 4"
              disabled={isLoading}
              className={`input-primary ${validationError ? 'failure-shake border-red-500' : ''} 
                disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {validationError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
              >
                {validationError}
              </motion.p>
            )}
          </div>
        ) : (
          // Multiple-choice selection
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {locales.puzzle.selectAnswer}
            </label>
            <div className="grid grid-cols-1 gap-3">
              {options?.map((option, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className={`px-4 py-3 rounded-lg border-2 font-mono text-lg transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      selectedOption === option
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-900 border-gray-600 text-gray-300 hover:border-blue-500'
                    }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
            {validationError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
              >
                {validationError}
              </motion.p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full mt-6 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? locales.puzzle.submitting : locales.puzzle.submit}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default AnswerInput;
