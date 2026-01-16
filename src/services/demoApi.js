// Demo API with mock data for preview mode

const demoPlayers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: null },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: null },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: null },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: null },
  { id: 5, name: 'Eve Williams', email: 'eve@example.com', phone: null },
  { id: 6, name: 'Frank Castle', email: 'frank@example.com', phone: null },
];

// Make demoGames mutable so we can add/delete games in demo mode
let demoGames = [
  {
    id: 1,
    game_date: '2024-01-15T19:00:00-08:00',
    creator_name: 'Alice Johnson',
    player_count: 6,
    positions_finalized: true,
  },
  {
    id: 2,
    game_date: '2024-02-12T19:00:00-08:00',
    creator_name: 'Bob Smith',
    player_count: 5,
    positions_finalized: true,
  },
  {
    id: 3,
    game_date: '2024-03-18T19:00:00-07:00',
    creator_name: 'Charlie Brown',
    player_count: 6,
    positions_finalized: false,
  },
];

// Counter for generating new game IDs
let nextGameId = 4;

const demoStats = {
  games_played: 15,
  total_points: 1250,
  avg_points: 83.3,
  avg_position: 2.5,
  first_place_finishes: 5,
  second_place_finishes: 4,
  third_place_finishes: 3,
  best_finish: 1,
  worst_finish: 6,
};

const demoLeaderboard = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    games_played: 18,
    total_points: 1580,
    avg_points: 87.8,
    avg_position: 2.1,
    first_place_finishes: 7,
    second_place_finishes: 5,
    third_place_finishes: 3,
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    games_played: 16,
    total_points: 1420,
    avg_points: 88.8,
    avg_position: 2.3,
    first_place_finishes: 6,
    second_place_finishes: 4,
    third_place_finishes: 4,
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    games_played: 17,
    total_points: 1350,
    avg_points: 79.4,
    avg_position: 2.8,
    first_place_finishes: 5,
    second_place_finishes: 6,
    third_place_finishes: 3,
  },
  {
    id: 4,
    name: 'Diana Prince',
    email: 'diana@example.com',
    games_played: 15,
    total_points: 1180,
    avg_points: 78.7,
    avg_position: 3.2,
    first_place_finishes: 4,
    second_place_finishes: 4,
    third_place_finishes: 3,
  },
  {
    id: 5,
    name: 'Eve Williams',
    email: 'eve@example.com',
    games_played: 14,
    total_points: 980,
    avg_points: 70.0,
    avg_position: 3.8,
    first_place_finishes: 2,
    second_place_finishes: 4,
    third_place_finishes: 5,
  },
  {
    id: 6,
    name: 'Frank Castle',
    email: 'frank@example.com',
    games_played: 12,
    total_points: 750,
    avg_points: 62.5,
    avg_position: 4.5,
    first_place_finishes: 1,
    second_place_finishes: 2,
    third_place_finishes: 3,
  },
];

const demoRecentForm = [
  { game_date: '2024-01-15', position: 1, points: 100 },
  { game_date: '2024-02-12', position: 3, points: 10 },
  { game_date: '2024-03-18', position: 2, points: 50 },
  { game_date: '2024-04-22', position: 1, points: 100 },
  { game_date: '2024-05-20', position: 2, points: 50 },
];

// Mock API functions that return demo data
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const syncPlayer = async (playerData, token) => {
  await delay(300);
  return demoPlayers[0];
};

export const getPlayers = async (token) => {
  await delay(300);
  return demoPlayers;
};

export const getPlayerStats = async (playerId, token) => {
  await delay(300);
  return demoStats;
};

export const getPlayerYearlyStats = async (playerId, token) => {
  await delay(300);
  return [
    { year: 2024, games_played: 8, total_points: 720, avg_points: 90, wins: 3 },
    { year: 2023, games_played: 7, total_points: 530, avg_points: 75.7, wins: 2 },
  ];
};

export const getPlayerGames = async (playerId, token) => {
  await delay(300);
  const pointsMap = { 1: 100, 2: 50, 3: 10 };
  return demoGames.map(g => {
    const position = Math.floor(Math.random() * 3) + 1;
    return { ...g, position, points: pointsMap[position] };
  });
};

export const getGames = async (token, year = null) => {
  await delay(300);
  return demoGames;
};

export const getGame = async (gameId, token) => {
  await delay(300);
  const pointsMap = { 1: 100, 2: 50, 3: 10 };
  return {
    game: demoGames[0],
    results: demoPlayers.slice(0, 6).map((p, i) => {
      const position = i + 1;
      return {
        player_id: p.id,
        player_name: p.name,
        player_email: p.email,
        position,
        points: pointsMap[position] || 0,
        attended: true,
      };
    }),
  };
};

export const createGame = async (gameData, token) => {
  await delay(300);

  const newGame = {
    id: nextGameId++,
    game_date: gameData.game_date,
    creator_name: 'Demo Player',
    player_count: 0,
    positions_finalized: false,
  };

  // Add to the beginning of the array so it shows up first
  demoGames.unshift(newGame);

  return newGame;
};

export const updateGameResults = async (gameId, results, token) => {
  await delay(300);

  // Find the game and update it
  const gameIndex = demoGames.findIndex(g => g.id === gameId);
  if (gameIndex !== -1) {
    demoGames[gameIndex].positions_finalized = true;
    demoGames[gameIndex].player_count = results.filter(r => r.attended).length;
  }

  return { success: true };
};

export const deleteGame = async (gameId, token) => {
  await delay(300);

  // Remove the game from the array
  const gameIndex = demoGames.findIndex(g => g.id === gameId);
  if (gameIndex !== -1) {
    demoGames.splice(gameIndex, 1);
  }

  return { success: true };
};

export const getLeaderboard = async (token, year = null) => {
  await delay(300);
  return demoLeaderboard;
};

export const getHeadToHead = async (player1Id, player2Id, token) => {
  await delay(300);
  return {
    games: [],
    totalGames: 0,
    player1Wins: 0,
    player2Wins: 0,
    player1AvgPosition: 0,
    player2AvgPosition: 0,
  };
};

export const getRecentForm = async (playerId, token) => {
  await delay(300);
  return demoRecentForm;
};

export const getMonthlyStats = async (token, year = null) => {
  await delay(300);
  return [
    { month: 1, games_played: 2, avg_players: 5.5 },
    { month: 2, games_played: 1, avg_players: 5.0 },
    { month: 3, games_played: 2, avg_players: 6.0 },
  ];
};

export const getAttendanceStats = async (token) => {
  await delay(300);
  return demoPlayers.map((p, i) => ({
    ...p,
    total_games: 15,
    attended_games: 15 - i,
    attendance_rate: ((15 - i) / 15 * 100).toFixed(1),
  }));
};

export const getStreaks = async (playerId, token) => {
  await delay(300);
  return {
    currentWinStreak: 2,
    currentPodiumStreak: 4,
    recentGames: demoRecentForm,
  };
};
