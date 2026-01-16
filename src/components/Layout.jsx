import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, BarChart3, Calendar, LogOut, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { player, signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Games', href: '/games', icon: Calendar },
    { name: 'Players', href: '/players', icon: Users },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-poker-card border-b border-poker-accent/20 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-poker-accent to-poker-gold rounded-lg flex items-center justify-center shadow-gold">
                <span className="text-2xl">♠️</span>
              </div>
              <div>
                <h1 className="text-lg font-display font-bold gold-gradient-text leading-tight">
                  Team Fun Poker Stars
                </h1>
                <p className="text-xs text-gray-400">Championship Series</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                      isActive
                        ? 'text-poker-gold'
                        : 'text-gray-300 hover:text-poker-accent'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-poker-accent/10 rounded-lg border border-poker-accent/30"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="font-medium relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{player?.name}</p>
                <p className="text-xs text-gray-400">{player?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg bg-poker-card hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-poker-accent/20">
          <nav className="flex justify-around py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-1 rounded-lg ${
                    isActive ? 'text-poker-gold' : 'text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-poker-accent/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>♠️ Team Fun Poker Stars Championship Series ♣️</p>
            <p className="mt-2">
              Built with elegance for champions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
