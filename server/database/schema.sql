-- Poker Championship Tracking Database Schema

-- Players table (authorized users)
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Games/Sessions table
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    created_by INTEGER REFERENCES players(id) ON DELETE SET NULL,
    game_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    positions_finalized BOOLEAN DEFAULT false,
    reminder_sent BOOLEAN DEFAULT false,
    notes TEXT
);

-- Game Results - tracks each player's position in each game
CREATE TABLE IF NOT EXISTS game_results (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    points INTEGER NOT NULL,
    attended BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, player_id),
    UNIQUE(game_id, position)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date DESC);
CREATE INDEX IF NOT EXISTS idx_game_results_game ON game_results(game_id);
CREATE INDEX IF NOT EXISTS idx_game_results_player ON game_results(player_id);
CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);
CREATE INDEX IF NOT EXISTS idx_players_firebase_uid ON players(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_players_is_active ON players(is_active) WHERE is_active = true;

-- View for player statistics
CREATE OR REPLACE VIEW player_stats AS
SELECT
    p.id,
    p.name,
    p.email,
    COUNT(DISTINCT gr.game_id) as games_played,
    SUM(gr.points) as total_points,
    AVG(gr.points) as avg_points,
    AVG(gr.position) as avg_position,
    SUM(CASE WHEN gr.position = 1 THEN 1 ELSE 0 END) as first_place_finishes,
    SUM(CASE WHEN gr.position = 2 THEN 1 ELSE 0 END) as second_place_finishes,
    SUM(CASE WHEN gr.position = 3 THEN 1 ELSE 0 END) as third_place_finishes,
    MIN(gr.position) as best_finish,
    MAX(gr.position) as worst_finish
FROM
    players p
LEFT JOIN
    game_results gr ON p.id = gr.player_id AND gr.attended = true
GROUP BY
    p.id, p.name, p.email;

-- View for yearly statistics
CREATE OR REPLACE VIEW yearly_stats AS
SELECT
    p.id as player_id,
    p.name,
    EXTRACT(YEAR FROM g.game_date) as year,
    COUNT(DISTINCT gr.game_id) as games_played,
    SUM(gr.points) as total_points,
    AVG(gr.points) as avg_points,
    AVG(gr.position) as avg_position,
    SUM(CASE WHEN gr.position = 1 THEN 1 ELSE 0 END) as wins
FROM
    players p
JOIN
    game_results gr ON p.id = gr.player_id AND gr.attended = true
JOIN
    games g ON gr.game_id = g.id
GROUP BY
    p.id, p.name, EXTRACT(YEAR FROM g.game_date);
