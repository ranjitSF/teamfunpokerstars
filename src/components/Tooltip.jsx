import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-poker-card',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-poker-card',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-poker-card',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-poker-card',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help"
      >
        {children || (
          <Info className="w-4 h-4 text-poker-accent hover:text-poker-gold transition-colors" />
        )}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positionClasses[position]} w-80`}
            style={{ pointerEvents: 'none' }}
          >
            <div className="bg-poker-card border border-poker-accent/30 rounded-lg shadow-xl p-4">
              <div className="text-sm text-gray-300 leading-relaxed text-left">
                {content}
              </div>
              {/* Arrow */}
              <div
                className={`absolute w-0 h-0 border-8 border-transparent ${arrowClasses[position]}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
