/**
 * Calculate points based on finishing position
 * Classic tournament-style scoring that rewards top finishes
 *
 * @param {number} position - Finishing position (1-indexed)
 * @param {number} totalPlayers - Total number of players who attended
 * @returns {number} Points earned
 */
export const calculatePoints = (position, totalPlayers) => {
  // Award points in descending order
  // Example: 8 players -> 1st: 100, 2nd: 85, 3rd: 70, 4th: 55, 5th: 40, 6th: 25, 7th: 15, 8th: 5

  const basePoints = 100;
  const decrement = Math.floor(basePoints / (totalPlayers + 1));

  const points = Math.max(5, basePoints - ((position - 1) * decrement));

  return points;
};

/**
 * Calculate all points for a game given positions
 * @param {Array} results - Array of {player_id, position, attended}
 * @returns {Array} Array with points added to each result
 */
export const calculateGamePoints = (results) => {
  const attendedPlayers = results.filter(r => r.attended);
  const totalPlayers = attendedPlayers.length;

  return results.map(result => {
    if (!result.attended) {
      return { ...result, points: 0 };
    }

    const points = calculatePoints(result.position, totalPlayers);
    return { ...result, points };
  });
};
