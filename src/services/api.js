const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// Player endpoints
export const syncPlayer = async (playerData, token) => {
  const response = await fetch(`${API_URL}/players/sync`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(playerData),
  });

  if (!response.ok) throw new Error('Failed to sync player');
  return response.json();
};

export const getPlayers = async (token) => {
  const response = await fetch(`${API_URL}/players`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch players');
  return response.json();
};

export const getPlayersWithStats = async (token) => {
  const response = await fetch(`${API_URL}/players/with-stats`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch players with stats');
  return response.json();
};

export const getPlayerStats = async (playerId, token) => {
  const response = await fetch(`${API_URL}/players/${playerId}/stats`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch player stats');
  return response.json();
};

export const getPlayerYearlyStats = async (playerId, token) => {
  const response = await fetch(`${API_URL}/players/${playerId}/yearly-stats`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch yearly stats');
  return response.json();
};

export const getPlayerGames = async (playerId, token) => {
  const response = await fetch(`${API_URL}/players/${playerId}/games`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch player games');
  return response.json();
};

export const updatePlayerName = async (playerId, name, token) => {
  const response = await fetch(`${API_URL}/players/${playerId}/name`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ name }),
  });

  if (!response.ok) throw new Error('Failed to update player name');
  return response.json();
};

export const addPlayer = async (playerData, token) => {
  const response = await fetch(`${API_URL}/players`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(playerData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add player');
  }
  return response.json();
};

// Game endpoints
export const getGames = async (token, year = null) => {
  const url = year ? `${API_URL}/games?year=${year}` : `${API_URL}/games`;
  const response = await fetch(url, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch games');
  return response.json();
};

export const getGame = async (gameId, token) => {
  const response = await fetch(`${API_URL}/games/${gameId}`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch game');
  return response.json();
};

export const createGame = async (gameData, token) => {
  const response = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(gameData),
  });

  if (!response.ok) throw new Error('Failed to create game');
  return response.json();
};

export const updateGameResults = async (gameId, results, token) => {
  const response = await fetch(`${API_URL}/games/${gameId}/results`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ results }),
  });

  if (!response.ok) throw new Error('Failed to update game results');
  return response.json();
};

export const deleteGame = async (gameId, token) => {
  const response = await fetch(`${API_URL}/games/${gameId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to delete game');
  return response.json();
};

// Stats endpoints
export const getLeaderboard = async (token, year = null) => {
  const url = year ? `${API_URL}/stats/leaderboard?year=${year}` : `${API_URL}/stats/leaderboard`;
  const response = await fetch(url, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch leaderboard');
  return response.json();
};

export const getHeadToHead = async (player1Id, player2Id, token) => {
  const response = await fetch(`${API_URL}/stats/head-to-head/${player1Id}/${player2Id}`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch head-to-head stats');
  return response.json();
};

export const getRecentForm = async (playerId, token) => {
  const response = await fetch(`${API_URL}/stats/recent-form/${playerId}`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch recent form');
  return response.json();
};

export const getMonthlyStats = async (token, year = null) => {
  const url = year ? `${API_URL}/stats/monthly?year=${year}` : `${API_URL}/stats/monthly`;
  const response = await fetch(url, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch monthly stats');
  return response.json();
};

export const getAttendanceStats = async (token) => {
  const response = await fetch(`${API_URL}/stats/attendance`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch attendance stats');
  return response.json();
};

export const getStreaks = async (playerId, token) => {
  const response = await fetch(`${API_URL}/stats/streaks/${playerId}`, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) throw new Error('Failed to fetch streaks');
  return response.json();
};
