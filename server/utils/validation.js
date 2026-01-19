/**
 * Input validation utilities
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
};

/**
 * Validates a name
 * @param {string} name - The name to validate
 * @param {number} minLength - Minimum length (default 1)
 * @param {number} maxLength - Maximum length (default 100)
 * @returns {boolean} - True if valid
 */
export const isValidName = (name, minLength = 1, maxLength = 100) => {
  return typeof name === 'string' &&
         name.trim().length >= minLength &&
         name.trim().length <= maxLength;
};

/**
 * Validates a date string
 * @param {string} dateStr - The date string to validate
 * @returns {boolean} - True if valid
 */
export const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

/**
 * Validates a positive integer
 * @param {any} value - The value to validate
 * @returns {boolean} - True if valid
 */
export const isPositiveInteger = (value) => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 0 && num === Number(value);
};

/**
 * Validates an array of game results
 * @param {Array} results - Array of result objects
 * @returns {Object} - { valid: boolean, error?: string }
 */
export const validateGameResults = (results) => {
  if (!Array.isArray(results)) {
    return { valid: false, error: 'Results must be an array' };
  }

  const attendedResults = results.filter(r => r.attended);

  // Check all attended players have valid positions
  for (const result of attendedResults) {
    if (!result.player_id) {
      return { valid: false, error: 'Each result must have a player_id' };
    }
    if (!isPositiveInteger(result.position)) {
      return { valid: false, error: 'Each attended player must have a valid position' };
    }
  }

  // Check for duplicate positions
  const positions = attendedResults.map(r => r.position);
  const uniquePositions = new Set(positions);
  if (positions.length !== uniquePositions.size) {
    return { valid: false, error: 'Duplicate positions are not allowed' };
  }

  return { valid: true };
};

/**
 * Sanitizes a string for safe database storage
 * @param {string} str - The string to sanitize
 * @returns {string} - Trimmed string
 */
export const sanitizeString = (str) => {
  return typeof str === 'string' ? str.trim() : '';
};
