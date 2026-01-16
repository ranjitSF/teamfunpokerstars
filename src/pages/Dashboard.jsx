import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, Calendar, Award, Target, Flame, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getPlayerStats, getRecentForm, getLeaderboard } from '../services';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import InfoTooltip from '../components/Tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { player, authToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentForm, setRecentForm] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!player || !authToken) return;

      try {
        const [statsData, formData, leaderboardData] = await Promise.all([
          getPlayerStats(player.id, authToken),
          getRecentForm(player.id, authToken),
          getLeaderboard(authToken),
        ]);

        setStats(statsData);
        setRecentForm(formData.reverse()); // Chronological order for chart
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [player, authToken]);

  if (loading) {
    return <LoadingSpinner text="Loading your stats..." />;
  }

  const playerRank = leaderboard.findIndex(p => p.id === player?.id) + 1;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold gold-gradient-text mb-2">
          Welcome back, {player?.name}
        </h1>
        <p className="text-gray-400">
          Your current rank: <span className="text-poker-gold font-bold">#{playerRank}</span> out of {leaderboard.length} players
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative">
          <StatCard
            icon={Trophy}
            label="Total Points"
            value={stats?.total_points || 0}
            subValue={`${stats?.games_played || 0} games played`}
            delay={0}
          />
          <div className="absolute top-4 right-4">
            <InfoTooltip
              content="Only the top 3 finishers earn points in each game: 1st place receives 100 points, 2nd place receives 50 points, and 3rd place receives 10 points. This scoring system rewards podium finishes and consistent top performance."
              position="bottom"
            >
              <Info className="w-4 h-4 text-poker-accent hover:text-poker-gold transition-colors" />
            </InfoTooltip>
          </div>
        </div>
        <StatCard
          icon={Award}
          label="Wins"
          value={stats?.first_place_finishes || 0}
          subValue={`${((stats?.first_place_finishes / stats?.games_played) * 100 || 0).toFixed(1)}% win rate`}
          delay={0.1}
        />
        <StatCard
          icon={Target}
          label="Average Position"
          value={(stats?.avg_position || 0).toFixed(1)}
          subValue={`Best: ${stats?.best_finish || '-'}`}
          delay={0.2}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Points/Game"
          value={(stats?.avg_points || 0).toFixed(1)}
          delay={0.3}
        />
      </div>

      {/* Recent Form Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-poker-card rounded-xl p-6 border border-poker-accent/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-white flex items-center">
            <Flame className="w-6 h-6 text-poker-accent mr-2" />
            Recent Performance
          </h2>
          <span className="chip chip-gold">Last 5 Games</span>
        </div>

        {recentForm.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentForm}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f45" />
              <XAxis
                dataKey="game_date"
                stroke="#888"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f35',
                  border: '1px solid #d4af37',
                  borderRadius: '8px',
                }}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="points"
                stroke="#d4af37"
                strokeWidth={3}
                dot={{ fill: '#ffd700', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-8">No recent games to display</p>
        )}
      </motion.div>

      {/* Podium Finishes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-poker-card rounded-xl p-6 border border-poker-accent/20"
      >
        <h2 className="text-2xl font-display font-bold text-white mb-6">Podium Finishes</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* First Place */}
          <div className="text-center p-6 bg-gradient-to-b from-yellow-500/20 to-transparent rounded-xl border border-yellow-500/30">
            <div className="text-4xl mb-2">🥇</div>
            <div className="text-3xl font-bold text-yellow-400">{stats?.first_place_finishes || 0}</div>
            <div className="text-sm text-gray-400 mt-1">First Place</div>
          </div>

          {/* Second Place */}
          <div className="text-center p-6 bg-gradient-to-b from-gray-400/20 to-transparent rounded-xl border border-gray-400/30">
            <div className="text-4xl mb-2">🥈</div>
            <div className="text-3xl font-bold text-gray-300">{stats?.second_place_finishes || 0}</div>
            <div className="text-sm text-gray-400 mt-1">Second Place</div>
          </div>

          {/* Third Place */}
          <div className="text-center p-6 bg-gradient-to-b from-orange-600/20 to-transparent rounded-xl border border-orange-600/30">
            <div className="text-4xl mb-2">🥉</div>
            <div className="text-3xl font-bold text-orange-400">{stats?.third_place_finishes || 0}</div>
            <div className="text-sm text-gray-400 mt-1">Third Place</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Link
          to="/games"
          className="bg-gradient-to-br from-poker-accent/20 to-poker-gold/10 rounded-xl p-8 border border-poker-accent/30 hover:border-poker-accent transition-all elegant-card group"
        >
          <Calendar className="w-12 h-12 text-poker-accent mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold text-white mb-2">Create New Game</h3>
          <p className="text-gray-400">Schedule your next poker night</p>
        </Link>

        <Link
          to="/leaderboard"
          className="bg-gradient-to-br from-poker-accent/20 to-poker-gold/10 rounded-xl p-8 border border-poker-accent/30 hover:border-poker-accent transition-all elegant-card group"
        >
          <Trophy className="w-12 h-12 text-poker-accent mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold text-white mb-2">View Leaderboard</h3>
          <p className="text-gray-400">See where you rank among champions</p>
        </Link>
      </motion.div>
    </div>
  );
};

export default Dashboard;
