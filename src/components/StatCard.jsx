import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, subValue, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-poker-card rounded-xl p-6 border border-poker-accent/20 elegant-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-bold gold-gradient-text">{value}</p>
          {subValue && (
            <p className="text-sm text-gray-500 mt-1">{subValue}</p>
          )}
        </div>
        {Icon && (
          <div className="bg-poker-accent/10 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-poker-accent" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            trend.direction === 'up' ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-xs text-gray-500 ml-2">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
