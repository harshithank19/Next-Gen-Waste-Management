
import React from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Recycle, Leaf, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

function FilterPanel({ selectedFilter, setSelectedFilter, onClose }) {
  const filters = [
    { id: 'all', label: 'All Bins', icon: Filter, color: 'from-slate-500 to-slate-600' },
    { id: 'general', label: 'General Waste', icon: Trash2, color: 'from-gray-500 to-gray-600' },
    { id: 'recycling', label: 'Recycling', icon: Recycle, color: 'from-blue-500 to-blue-600' },
    { id: 'organic', label: 'Organic Waste', icon: Leaf, color: 'from-green-500 to-green-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-green-400">Filter Bins</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isSelected = selectedFilter === filter.id;
            
            return (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                  isSelected 
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                    : 'bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-700/70'
                }`}
                onClick={() => {
                  setSelectedFilter(filter.id);
                  onClose();
                }}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${filter.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{filter.label}</p>
                  <p className="text-sm opacity-70">
                    {filter.id === 'all' ? 'Show all waste bins' : `Show only ${filter.label.toLowerCase()} bins`}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400 text-center">
            Filter bins by waste type to find exactly what you need
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default FilterPanel;
