import React from 'react';
import { Compass, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotFoundPageProps {
  onReturnHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome }) => {
  return (
    <div className="flex-1 p-6 flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-modal w-full max-w-md p-8 text-center space-y-6 border border-purple-500/30 shadow-2xl relative"
      >
        <div className="w-20 h-20 rounded-3xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center mx-auto shadow-xl">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
            404
          </span>
          <h2 className="font-extrabold text-xl text-slate-100">Page Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The workspace view or route you requested does not exist or has been relocated to another workspace directory.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onReturnHome}
            className="glass-button-primary text-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
