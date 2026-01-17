// API service selector - uses demo API in demo mode, real API otherwise
const isDemoMode = import.meta.env.VITE_MODE === 'demo';

// Import from the appropriate module
import * as demoApi from './demoApi.js';
import * as realApi from './api.js';

// Select the API based on mode
const api = isDemoMode ? demoApi : realApi;

// Re-export all functions
export const syncPlayer = api.syncPlayer;
export const getPlayers = api.getPlayers;
export const getPlayerStats = api.getPlayerStats;
export const getPlayerYearlyStats = api.getPlayerYearlyStats;
export const getPlayerGames = api.getPlayerGames;
export const updatePlayerName = api.updatePlayerName;
export const getGames = api.getGames;
export const getGame = api.getGame;
export const createGame = api.createGame;
export const updateGameResults = api.updateGameResults;
export const deleteGame = api.deleteGame;
export const getLeaderboard = api.getLeaderboard;
export const getHeadToHead = api.getHeadToHead;
export const getRecentForm = api.getRecentForm;
export const getMonthlyStats = api.getMonthlyStats;
export const getAttendanceStats = api.getAttendanceStats;
export const getStreaks = api.getStreaks;
