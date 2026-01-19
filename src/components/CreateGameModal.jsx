import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CreateGameModal = ({ onClose, onCreate }) => {
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

export default CreateGameModal;
