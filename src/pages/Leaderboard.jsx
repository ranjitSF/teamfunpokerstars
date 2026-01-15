import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getLeaderboard } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Leaderboard = () => {
  const { authToken, player } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const year = selectedYear === 'all' ? null : selectedYear;
        const data = await getLeaderboard(authToken, year);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchLeaderboard();
    }
  }, [authToken, selectedYear]);

  if (loading) {
    return <LoadingSpinner text="Loading leaderboard..." />;
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/50';
      default:
        return 'bg-poker-card border-poker-accent/10';
    }
  };

  const years = ['all', '2024', '2023', '2022'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold gold-gradient-text mb-4">
          Championship Leaderboard
        </h1>
        <p className="text-gray-400">Where legends are made</p>
      </motion.div>

      {/* Year Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center space-x-2"
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

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-8"
        >
          {/* Second Place */}
          <div className="flex flex-col items-center pt-12">
            <div className="bg-gradient-to-b from-gray-400/20 to-transparent p-6 rounded-xl border border-gray-400/30 w-full text-center">
              <Medal className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-300">2nd</div>
              <div className="mt-4">
                <p className="font-semibold text-white text-lg">{leaderboard[1].name}</p>
                <p className="text-3xl font-bold gold-gradient-text mt-2">{leaderboard[1].total_points || 0}</p>
                <p className="text-xs text-gray-400">points</p>
              </div>
            </div>
          </div>

          {/* First Place */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-b from-yellow-500/30 to-transparent p-8 rounded-xl border-2 border-yellow-500/50 w-full text-center shadow-gold">
              <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-2 animate-pulse" />
              <div className="text-3xl font-bold text-yellow-400">1st</div>
              <div className="mt-4">
                <p className="font-bold text-white text-xl">{leaderboard[0].name}</p>
                <p className="text-4xl font-bold gold-gradient-text mt-2">{leaderboard[0].total_points || 0}</p>
                <p className="text-xs text-gray-400">points</p>
              </div>
            </div>
          </div>

          {/* Third Place */}
          <div className="flex flex-col items-center pt-12">
            <div className="bg-gradient-to-b from-orange-600/20 to-transparent p-6 rounded-xl border border-orange-600/30 w-full text-center">
              <Medal className="w-12 h-12 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-400">3rd</div>
              <div className="mt-4">
                <p className="font-semibold text-white text-lg">{leaderboard[2].name}</p>
                <p className="text-3xl font-bold gold-gradient-text mt-2">{leaderboard[2].total_points || 0}</p>
                <p className="text-xs text-gray-400">points</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-poker-card rounded-xl border border-poker-accent/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-poker-darker border-b border-poker-accent/20">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Player</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Games</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Wins</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Avg Position</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((playerData, index) => {
                const rank = index + 1;
                const isCurrentPlayer = playerData.id === player?.id;

                return (
                  <motion.tr
                    key={playerData.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className={`border-b border-poker-accent/10 hover:bg-poker-darker/50 transition-colors ${
                      isCurrentPlayer ? 'bg-poker-accent/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getRankIcon(rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className={`font-semibold ${isCurrentPlayer ? 'text-poker-gold' : 'text-white'}`}>
                          {playerData.name}
                          {isCurrentPlayer && <span className="ml-2 chip chip-gold text-xs">You</span>}
                        </p>
                        <p className="text-xs text-gray-500">{playerData.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {playerData.games_played || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="chip chip-green">
                        {playerData.first_place_finishes || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {(playerData.avg_position || 0).toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xl font-bold gold-gradient-text">
                        {playerData.total_points || 0}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
