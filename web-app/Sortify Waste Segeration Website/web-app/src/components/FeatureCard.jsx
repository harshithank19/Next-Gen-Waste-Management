
import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

function FeatureCard({ feature, index }) {
  const { toast } = useToast();
  const Icon = feature.icon;

  const handleFeatureClick = () => {
    toast({
      title: `${feature.title}`,
      description: " This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="group cursor-pointer"
      onClick={handleFeatureClick}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 h-full transition-all duration-300 hover:border-green-500/50">
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        {/* Icon */}
        <div className="relative mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative">
          <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-green-400 transition-colors duration-300">
            📍 {feature.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
            {feature.description}
          </p>
        </div>

        {/* Hover effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
}

export default FeatureCard;
