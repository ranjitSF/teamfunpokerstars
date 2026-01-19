// API service selector - uses demo API in demo mode, real API otherwise
import { isDemoMode } from '../config/app';

// Dynamically re-export all functions from the appropriate API module
const api = isDemoMode
  ? await import('./demoApi.js')
  : await import('./api.js');

export const {
  syncPlayer,
  getPlayers,
  getPlayersWithStats,
  getPlayerStats,
  getPlayerYearlyStats,
  getPlayerGames,
  updatePlayerName,
  addPlayer,
  getGames,
  getGame,
  createGame,
  updateGameResults,
  deleteGame,
  getLeaderboard,
  getHeadToHead,
  getRecentForm,
  getMonthlyStats,
  getAttendanceStats,
  getStreaks,
} = api;
