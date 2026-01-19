import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import InfoTooltip from './Tooltip';

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
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-2xl font-display font-bold gold-gradient-text">
            Enter Game Results
          </h2>
          <InfoTooltip
            content="Only the top 3 finishers earn points: 1st place earns 100 points, 2nd place earns 50 points, and 3rd place earns 10 points. All other positions earn 0 points. Aim for the podium!"
            position="left"
          >
            <Info className="w-5 h-5 text-poker-accent hover:text-poker-gold transition-colors cursor-help" />
          </InfoTooltip>
        </div>
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

export default ResultsModal;
