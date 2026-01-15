import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Users, Edit, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getGames, createGame, getPlayers, updateGameResults, deleteGame, getGame } from '../services/api';
import { formatInTimeZone } from 'date-fns-tz';
import LoadingSpinner from '../components/LoadingSpinner';

const Games = () => {
  const { authToken, currentUser } = useAuth();
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    fetchData();
  }, [authToken, selectedYear]);

  const fetchData = async () => {
    try {
      const year = selectedYear === 'all' ? null : selectedYear;
      const [gamesData, playersData] = await Promise.all([
        getGames(authToken, year),
        getPlayers(authToken),
      ]);
      setGames(gamesData);
      setPlayers(playersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async (gameData) => {
    try {
      await createGame({
        ...gameData,
        created_by_uid: currentUser.uid,
      }, authToken);
      await fetchData();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game');
    }
  };

  const handleEditResults = async (gameId) => {
    try {
      const gameData = await getGame(gameId, authToken);
      setSelectedGame(gameData);
      setShowResultsModal(true);
    } catch (error) {
      console.error('Error fetching game:', error);
    }
  };

  const handleSaveResults = async (results) => {
    try {
      await updateGameResults(selectedGame.game.id, results, authToken);
      await fetchData();
      setShowResultsModal(false);
      setSelectedGame(null);
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results');
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      await deleteGame(gameId, authToken);
      await fetchData();
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Failed to delete game');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading games..." />;
  }

  const years = ['all', '2024', '2023', '2022'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold gold-gradient-text mb-2">
            Game History
          </h1>
          <p className="text-gray-400">Manage poker sessions and results</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Game</span>
        </button>
      </motion.div>

      {/* Year Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-2"
      >
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedYear === year
                ? 'bg-poker-accent text-poker-dark'
                : 'bg-poker-card text-gray-400 hover:text-white border border-poker-accent/20'
            }`}
          >
            {year === 'all' ? 'All Time' : year}
          </button>
        ))}
      </motion.div>

      {/* Games List */}
      <div className="grid gap-4">
        {games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-poker-card rounded-xl p-12 border border-poker-accent/20 text-center"
          >
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No games found for this period</p>
          </motion.div>
        ) : (
          games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="bg-poker-card rounded-xl p-6 border border-poker-accent/20 hover:border-poker-accent/40 transition-all elegant-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-5 h-5 text-poker-accent" />
                    <h3 className="text-xl font-bold text-white">
                      {new Date(game.game_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    {game.positions_finalized ? (
                      <span className="chip chip-green">Completed</span>
                    ) : (
                      <span className="chip chip-red">Pending Results</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{game.player_count} players</span>
                    </div>
                    <span>•</span>
                    <span>Created by {game.creator_name}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditResults(game.id)}
                    className="p-2 rounded-lg bg-poker-accent/10 hover:bg-poker-accent/20 text-poker-accent transition-all"
                    title="Edit Results"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGame(game.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                    title="Delete Game"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Game Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateGameModal
            players={players}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateGame}
          />
        )}
      </AnimatePresence>

      {/* Results Modal */}
      <AnimatePresence>
        {showResultsModal && selectedGame && (
          <ResultsModal
            game={selectedGame}
            players={players}
            onClose={() => {
              setShowResultsModal(false);
              setSelectedGame(null);
            }}
            onSave={handleSaveResults}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Create Game Modal Component
const CreateGameModal = ({ players, onClose, onCreate }) => {
  const [gameDate, setGameDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ game_date: gameDate, notes });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-poker-card rounded-2xl p-8 max-w-md w-full border border-poker-accent/30"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-display font-bold gold-gradient-text mb-6">
          Create New Game
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Game Date (PST)
            </label>
            <input
              type="datetime-local"
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
              required
              className="w-full px-4 py-3 bg-poker-darker border border-poker-accent/30 rounded-lg text-white focus:outline-none focus:border-poker-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-poker-darker border border-poker-accent/30 rounded-lg text-white focus:outline-none focus:border-poker-accent transition-colors resize-none"
              placeholder="Any special notes about this game..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              Create Game
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Results Modal Component
const ResultsModal = ({ game, players, onClose, onSave }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Initialize results with existing data or all players
    const initialResults = players.map((player) => {
      const existingResult = game.results.find((r) => r.player_id === player.id);
      return {
        player_id: player.id,
        player_name: player.name,
        attended: existingResult?.attended ?? true,
        position: existingResult?.position || null,
      };
    });
    setResults(initialResults);
  }, [game, players]);

  const handleAttendanceChange = (playerId, attended) => {
    setResults((prev) =>
      prev.map((r) => (r.player_id === playerId ? { ...r, attended, position: attended ? r.position : null } : r))
    );
  };

  const handlePositionChange = (playerId, position) => {
    setResults((prev) =>
      prev.map((r) => (r.player_id === playerId ? { ...r, position: parseInt(position) } : r))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate: all attended players must have positions
    const attendedPlayers = results.filter((r) => r.attended);
    const hasInvalidPositions = attendedPlayers.some((r) => !r.position);

    if (hasInvalidPositions) {
      alert('Please assign positions to all players who attended');
      return;
    }

    // Validate: no duplicate positions
    const positions = attendedPlayers.map((r) => r.position);
    const hasDuplicates = positions.some((p, i) => positions.indexOf(p) !== i);

    if (hasDuplicates) {
      alert('Each position must be unique');
      return;
    }

    onSave(results);
  };

  const attendedCount = results.filter((r) => r.attended).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-poker-card rounded-2xl p-8 max-w-2xl w-full border border-poker-accent/30 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-display font-bold gold-gradient-text mb-2">
          Enter Game Results
        </h2>
        <p className="text-gray-400 mb-6">
          {new Date(game.game.game_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-poker-darker rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400">
              Players attended: <span className="text-poker-gold font-bold">{attendedCount}</span>
            </p>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {results.map((result) => (
              <div
                key={result.player_id}
                className="bg-poker-darker rounded-lg p-4 border border-poker-accent/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-white">{result.player_name}</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={result.attended}
                      onChange={(e) => handleAttendanceChange(result.player_id, e.target.checked)}
                      className="w-5 h-5 rounded bg-poker-card border-poker-accent/30 text-poker-accent focus:ring-poker-accent"
                    />
                    <span className="text-sm text-gray-400">Attended</span>
                  </label>
                </div>

                {result.attended && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Position</label>
                    <select
                      value={result.position || ''}
                      onChange={(e) => handlePositionChange(result.player_id, e.target.value)}
                      required={result.attended}
                      className="w-full px-3 py-2 bg-poker-card border border-poker-accent/30 rounded-lg text-white focus:outline-none focus:border-poker-accent"
                    >
                      <option value="">Select position...</option>
                      {Array.from({ length: attendedCount }, (_, i) => i + 1).map((pos) => (
                        <option key={pos} value={pos}>
                          {pos === 1 ? '🥇 1st Place' : pos === 2 ? '🥈 2nd Place' : pos === 3 ? '🥉 3rd Place' : `${pos}th Place`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 btn-primary">
              Save Results
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Games;
