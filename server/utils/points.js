/**
 * Calculate points based on finishing position
 * Only top 3 finishers earn points:
 * 1st: 100 points, 2nd: 50 points, 3rd: 10 points, 4th+: 0 points
 *
 * @param {number} position - Finishing position (1-indexed)
 * @returns {number} Points earned
 */
export const calculatePoints = (position) => {
  switch (position) {
    case 1:
      return 100;
    case 2:
      return 50;
    case 3:
      return 10;
    default:
      return 0;
  }
};

/**
 * Calculate all points for a game given positions
 * @param {Array} results - Array of {player_id, position, attended}
 * @returns {Array} Array with points added to each result
 */
export const calculateGamePoints = (results) => {
  return results.map(result => {
    if (!result.attended) {
      return { ...result, points: 0 };
    }
    return { ...result, points: calculatePoints(result.position) };
  });
};
