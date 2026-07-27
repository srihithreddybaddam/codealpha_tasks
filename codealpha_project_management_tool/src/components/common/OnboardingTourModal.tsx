import React, { useState } from 'react';
import { Sparkles, Layers, Kanban, ArrowRight, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to AETHER PM',
      subtitle: '2026 Specular Glassmorphism Workspace',
      description: 'Experience a ultra-fast, high-aesthetic SaaS project management environment inspired by the best concepts of Linear, ClickUp, Notion, and Jira.',
      icon: <Layers className="w-8 h-8 text-purple-400" />
    },
    {
      title: 'Interactive Sprint Kanban & Task Management',
      subtitle: 'Drag & Drop with Subtasks & Custom Columns',
      description: 'Reorder columns, create subtasks, track checklists, and log developer time with Web Audio API sound FX.',
      icon: <Kanban className="w-8 h-8 text-cyan-400" />
    },
    {
      title: 'Autonomous Aether AI Copilot',
      subtitle: '1-Click Subtask Breakdown & Health Audits',
      description: 'Access Aether AI anytime to auto-generate checklists, estimate dev hours, and audit sprint velocity risks.',
      icon: <Sparkles className="w-8 h-8 text-pink-400" />
    }
  ];

  const current = tourSteps[step];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-modal w-full max-w-md p-6 space-y-6 border border-purple-500/40 shadow-2xl relative text-center"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto shadow-xl">
            {current.icon}
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-slate-100">{current.title}</h3>
            <p className="text-xs text-purple-300 font-semibold">{current.subtitle}</p>
            <p className="text-xs text-slate-300 leading-relaxed pt-2">{current.description}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              {tourSteps.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${step === i ? 'w-5 bg-purple-400' : 'bg-white/20'}`}
                />
              ))}
            </div>

            {step < tourSteps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="glass-button-primary text-xs"
              >
                <span>Next Feature</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="glass-button-primary text-xs"
              >
                <span>Enter Workspace</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
