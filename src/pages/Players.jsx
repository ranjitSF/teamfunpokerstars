import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Award, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getPlayers, getPlayerStats } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Players = () => {
  const { authToken } = useAuth();
  const [players, setPlayers] = useState([]);
  const [playersWithStats, setPlayersWithStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    if (authToken) {
      fetchData();
    }
  }, [authToken]);

  if (loading) {
    return <LoadingSpinner text="Loading players..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold gold-gradient-text mb-2">
          Players
        </h1>
        <p className="text-gray-400">Meet the championship contenders</p>
      </motion.div>

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
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-poker-accent to-poker-gold rounded-full flex items-center justify-center font-bold text-poker-dark text-xl">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{player.name}</h3>
                  <p className="text-xs text-gray-400">{player.email}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between bg-poker-darker rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-poker-accent" />
                  <span className="text-sm text-gray-400">Total Points</span>
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
