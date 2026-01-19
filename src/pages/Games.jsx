import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Users, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getGames, createGame, getPlayers, updateGameResults, deleteGame, getGame } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateGameModal from '../components/CreateGameModal';
import ResultsModal from '../components/ResultsModal';

const Games = () => {
  const { authToken, currentUser, isAdmin } = useAuth();
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

  const years = ['all', '2026'];

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
        {/* Admin Only: Create Game Button */}
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Game</span>
          </button>
        )}
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
                  {/* Admin Only: Delete Game Button */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteGame(game.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                      title="Delete Game"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
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

export default Games;
