class SolutionValidator {
  constructor() {
    // Operator mappings for normalization
    this.operatorMap = {
      '>': '>',
      '<': '<',
      '>=': '≥',
      '≥': '≥',
      '<=': '≤',
      '≤': '≤',
      '≧': '≥',
      '≦': '≤'
    };
  }

  /**
   * Validates a player's answer against the correct solution
   * @param {string} playerAnswer - The answer submitted by the player
   * @param {string} correctSolution - The correct solution in inequality form
   * @returns {Object} - { correct: boolean, feedback: string }
   */
  validate(playerAnswer, correctSolution) {
    try {
      // Normalize both answers
      const normalizedPlayer = this.normalizeAnswer(playerAnswer);
      const normalizedCorrect = this.normalizeAnswer(correctSolution);

      // Parse both solutions
      const playerParsed = this.parseAnswer(normalizedPlayer);
      const correctParsed = this.parseAnswer(normalizedCorrect);

      // Compare the parsed solutions
      const isCorrect = this.compareSolutions(playerParsed, correctParsed);

      return {
        correct: isCorrect,
        feedback: isCorrect 
          ? 'Corretto! Hai risolto il puzzle!' 
          : 'Non è corretto. Riprova!'
      };
    } catch (error) {
      return {
        correct: false,
        feedback: 'Formato della risposta non valido. Usa il formato "x > 4" o "(4, ∞)".'
      };
    }
  }

  /**
   * Normalizes an answer by removing extra spaces and standardizing format
   * @param {string} answer - The answer to normalize
   * @returns {string} - Normalized answer
   */
  normalizeAnswer(answer) {
    if (!answer || typeof answer !== 'string') {
      throw new Error('Invalid answer format');
    }

    // Remove extra whitespace
    let normalized = answer.trim().replace(/\s+/g, ' ');

    // Normalize operators
    normalized = normalized.replace(/≧/g, '≥').replace(/≦/g, '≤');
    normalized = normalized.replace(/>=/g, '≥').replace(/<=/g, '≤');

    return normalized;
  }

  /**
   * Parses an answer into a structured format
   * @param {string} answer - The answer to parse
   * @returns {Object} - { type: 'inequality', operator: string, value: number }
   */
  parseAnswer(answer) {
    // Try parsing as inequality form first (e.g., "x > 4")
    const inequalityParsed = this.parseInequalityForm(answer);
    if (inequalityParsed) {
      return inequalityParsed;
    }

    // Try parsing as interval notation (e.g., "(4, ∞)")
    const intervalParsed = this.parseIntervalNotation(answer);
    if (intervalParsed) {
      return intervalParsed;
    }

    throw new Error('Unable to parse answer');
  }

  /**
   * Parses inequality form (e.g., "x > 4", "x ≤ -3")
   * @param {string} answer - The answer in inequality form
   * @returns {Object|null} - Parsed result or null if invalid
   */
  parseInequalityForm(answer) {
    // Match patterns like "x > 4", "x >= -3.5", "x ≤ 10"
    const pattern = /^x\s*([><=≥≤]+)\s*([-+]?\d+\.?\d*)$/;
    const match = answer.match(pattern);

    if (!match) {
      return null;
    }

    const operator = this.operatorMap[match[1]] || match[1];
    const value = parseFloat(match[2]);

    if (isNaN(value)) {
      return null;
    }

    return {
      type: 'inequality',
      operator,
      value
    };
  }

  /**
   * Parses interval notation (e.g., "(4, ∞)", "(-∞, 4]")
   * @param {string} answer - The answer in interval notation
   * @returns {Object|null} - Parsed result or null if invalid
   */
  parseIntervalNotation(answer) {
    // Remove spaces for easier parsing
    const cleaned = answer.replace(/\s/g, '');

    // Match patterns like "(4, ∞)", "(-∞, 4]", "[3, ∞)", "(-∞, -5)"
    const pattern = /^([\[\(])([-+]?\d+\.?\d*|[-+]?∞),([-+]?\d+\.?\d*|[-+]?∞)([\]\)])$/;
    const match = cleaned.match(pattern);

    if (!match) {
      return null;
    }

    const leftBracket = match[1];
    const leftValue = match[2];
    const rightValue = match[3];
    const rightBracket = match[4];

    // Determine operator and value based on which side has infinity
    if (rightValue === '∞' || rightValue === '+∞') {
      // Format: (a, ∞) means x > a, [a, ∞) means x ≥ a
      const value = parseFloat(leftValue);
      if (isNaN(value)) {
        return null;
      }
      const operator = leftBracket === '(' ? '>' : '≥';
      return {
        type: 'inequality',
        operator,
        value
      };
    } else if (leftValue === '-∞' || leftValue === '∞') {
      // Format: (-∞, a) means x < a, (-∞, a] means x ≤ a
      const value = parseFloat(rightValue);
      if (isNaN(value)) {
        return null;
      }
      const operator = rightBracket === ')' ? '<' : '≤';
      return {
        type: 'inequality',
        operator,
        value
      };
    }

    return null;
  }

  /**
   * Compares two parsed solutions for mathematical equivalence
   * @param {Object} solution1 - First parsed solution
   * @param {Object} solution2 - Second parsed solution
   * @returns {boolean} - True if solutions are equivalent
   */
  compareSolutions(solution1, solution2) {
    // Both must be inequality type
    if (solution1.type !== 'inequality' || solution2.type !== 'inequality') {
      return false;
    }

    // Operators must match
    if (solution1.operator !== solution2.operator) {
      return false;
    }

    // Values must be equal (with tolerance for floating point)
    const tolerance = 0.0001;
    return Math.abs(solution1.value - solution2.value) < tolerance;
  }
}

export default SolutionValidator;
