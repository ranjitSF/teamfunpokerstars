import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Award, Target, UserPlus, X, Info, Edit2, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getPlayers, getPlayerStats, updatePlayerName } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import InfoTooltip from '../components/Tooltip';

const Players = () => {
  const { authToken, isAdmin, currentUser } = useAuth();
  const [players, setPlayers] = useState([]);
  const [playersWithStats, setPlayersWithStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerEmail, setNewPlayerEmail] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [addPlayerLoading, setAddPlayerLoading] = useState(false);
  const [addPlayerError, setAddPlayerError] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [updateNameLoading, setUpdateNameLoading] = useState(false);

  const fetchData = async () => {
    try {
      const playersData = await getPlayers(authToken);
      setPlayers(playersData);

      // Fetch stats for each player
      const statsPromises = playersData.map(async (player) => {
        const stats = await getPlayerStats(player.id, authToken);
        return { ...player, stats };
      });

      const playersWithStatsData = await Promise.all(statsPromises);
      setPlayersWithStats(playersWithStatsData);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setAddPlayerError('');
    setAddPlayerLoading(true);

    try {
      // TODO: Implement backend API call to add player
      // For now, just show a message
      alert(`Adding player: ${newPlayerName} (${newPlayerEmail})\n\nBackend API endpoint needs to be implemented.`);

      // Reset form
      setNewPlayerEmail('');
      setNewPlayerName('');
      setShowAddPlayer(false);

      // Refresh player list
      await fetchData();
    } catch (error) {
      setAddPlayerError(error.message || 'Failed to add player');
    } finally {
      setAddPlayerLoading(false);
    }
  };

  const handleEditName = (player) => {
    setEditingPlayerId(player.id);
    setEditedName(player.name);
  };

  const handleSaveName = async (playerId) => {
    if (!editedName.trim()) {
      return;
    }

    setUpdateNameLoading(true);
    try {
      await updatePlayerName(playerId, editedName, authToken);

      // Update local state
      setPlayersWithStats(playersWithStats.map(p =>
        p.id === playerId ? { ...p, name: editedName } : p
      ));

      setEditingPlayerId(null);
      setEditedName('');
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name. Please try again.');
    } finally {
      setUpdateNameLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlayerId(null);
    setEditedName('');
  };

  if (loading) {
    return <LoadingSpinner text="Loading players..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold gold-gradient-text mb-2">
            Players
          </h1>
          <p className="text-gray-400">Meet the championship contenders</p>
        </div>

        {/* Admin Only: Add Player Button */}
        {isAdmin && (
          <button
            onClick={() => setShowAddPlayer(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add Player
          </button>
        )}
      </motion.div>

      {/* Add Player Modal */}
      <AnimatePresence>
        {showAddPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddPlayer(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-poker-card rounded-2xl p-8 border border-poker-accent/20 shadow-card max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gold-gradient-text">Add New Player</h2>
                <button
                  onClick={() => setShowAddPlayer(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddPlayer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-poker-darker border border-poker-accent/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-poker-accent transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newPlayerEmail}
                    onChange={(e) => setNewPlayerEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-poker-darker border border-poker-accent/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-poker-accent transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                {addPlayerError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{addPlayerError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPlayer(false)}
                    className="flex-1 px-4 py-3 bg-poker-darker text-white rounded-lg hover:bg-poker-darker/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addPlayerLoading}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {addPlayerLoading ? 'Adding...' : 'Add Player'}
                  </button>
                </div>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                The player will receive a magic link via email to sign in.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playersWithStats.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="bg-poker-card rounded-xl p-6 border border-poker-accent/20 elegant-card"
          >
            {/* Player Avatar */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-poker-accent to-poker-gold rounded-full flex items-center justify-center font-bold text-poker-dark text-xl">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  {editingPlayerId === player.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="px-2 py-1 bg-poker-darker border border-poker-accent/30 rounded text-white text-sm focus:outline-none focus:border-poker-accent"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveName(player.id)}
                        disabled={updateNameLoading}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={updateNameLoading}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{player.name}</h3>
                        <p className="text-xs text-gray-400">{player.email}</p>
                      </div>
                      {currentUser && currentUser.id === player.id && (
                        <button
                          onClick={() => handleEditName(player)}
                          className="text-gray-400 hover:text-poker-accent transition-colors"
                          title="Edit name"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between bg-poker-darker rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-poker-accent" />
                  <span className="text-sm text-gray-400">Total Points</span>
                  <InfoTooltip
                    content="Only top 3 finishers earn points: 1st place earns 100 points, 2nd place earns 50 points, and 3rd place earns 10 points."
                    position="top"
                  >
                    <Info className="w-3 h-3 text-poker-accent/70 hover:text-poker-gold transition-colors cursor-help" />
                  </InfoTooltip>
                </div>
                <span className="font-bold gold-gradient-text">
                  {player.stats.total_points || 0}
                </span>
              </div>

              <div className="flex items-center justify-between bg-poker-darker rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-poker-accent" />
                  <span className="text-sm text-gray-400">Games Played</span>
                </div>
                <span className="font-bold text-white">
                  {player.stats.games_played || 0}
                </span>
              </div>

              <div className="flex items-center justify-between bg-poker-darker rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-poker-accent" />
                  <span className="text-sm text-gray-400">Wins</span>
                </div>
                <span className="font-bold text-green-400">
                  {player.stats.first_place_finishes || 0}
                </span>
              </div>

              <div className="flex items-center justify-between bg-poker-darker rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Avg Position</span>
                </div>
                <span className="font-bold text-white">
                  {(player.stats.avg_position || 0).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Podium Badges */}
            {(player.stats.first_place_finishes > 0 ||
              player.stats.second_place_finishes > 0 ||
              player.stats.third_place_finishes > 0) && (
              <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-poker-accent/20">
                {player.stats.first_place_finishes > 0 && (
                  <div className="flex items-center space-x-1 chip chip-gold">
                    <span>🥇</span>
                    <span>{player.stats.first_place_finishes}</span>
                  </div>
                )}
                {player.stats.second_place_finishes > 0 && (
                  <div className="flex items-center space-x-1 chip bg-gray-500/20 text-gray-300 border-gray-500/30">
                    <span>🥈</span>
                    <span>{player.stats.second_place_finishes}</span>
                  </div>
                )}
                {player.stats.third_place_finishes > 0 && (
                  <div className="flex items-center space-x-1 chip bg-orange-500/20 text-orange-300 border-orange-500/30">
                    <span>🥉</span>
                    <span>{player.stats.third_place_finishes}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Players;
