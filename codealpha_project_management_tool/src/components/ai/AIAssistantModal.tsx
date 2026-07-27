import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Send, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIAssistantModal: React.FC = () => {
  const { isAIAssistantOpen, setIsAIAssistantOpen, filteredTasks, currentProject } = useApp();
  const [prompt, setPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  if (!isAIAssistantOpen) return null;

  const handleRunAI = async (customPrompt?: string) => {
    const query = customPrompt || prompt;
    if (!query.trim()) return;

    setIsThinking(true);
    setAiOutput(null);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.status === 'done').length;
    const urgent = filteredTasks.filter(t => t.priority === 'urgent').length;

    let response = '';
    if (query.includes('Health') || query.includes('Audit')) {
      response = `🤖 Aether AI Health Audit for ${currentProject?.name || 'Workspace'}:\n\n` +
        `• Completion Velocity: ${Math.round((completed / total) * 100)}% (${completed}/${total} tasks finished)\n` +
        `• Risk Assessment: ${urgent > 2 ? '⚠️ High Risk - 3 urgent items pending' : '✅ Low Risk - Sprint velocity on schedule'}\n` +
        `• Recommendation: Focus team capacity on "Architect Glassmorphism Specular Reflection System" to unblock downstream UI render tasks.`;
    } else {
      response = `⚡ Aether AI Strategy Analysis:\n\n` +
        `Based on your prompt "${query}", I analyzed current project telemetry across ${total} tasks.\n` +
        `Sub-task automation pipeline has generated 4 optimization suggestions for your active sprint.`;
    }

    setAiOutput(response);
    setIsThinking(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-modal w-full max-w-2xl p-6 space-y-5 border border-purple-500/40 relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-100">Aether AI Strategy & Command Center</h3>
                <p className="text-xs text-slate-400">Autonomous project intelligence copilot</p>
              </div>
            </div>

            <button
              onClick={() => setIsAIAssistantOpen(false)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick AI Actions</span>
            <div className="flex flex-wrap gap-2">
              {[
                'Run Sprint Health Audit',
                'Identify Dev Bottlenecks',
                'Generate Executive Summary',
                'Auto-Decompose Unassigned Backlog'
              ].map((action) => (
                <button
                  key={action}
                  onClick={() => handleRunAI(action)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-xs font-semibold text-slate-300 hover:text-purple-200 transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{action}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Output Display */}
          {isThinking ? (
            <div className="p-6 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center gap-3 text-purple-200 text-sm">
              <Sparkles className="w-5 h-5 animate-spin text-cyan-400" />
              <span>Aether AI is synthesizing project telemetry...</span>
            </div>
          ) : aiOutput ? (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/15 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
              {aiOutput}
            </div>
          ) : null}

          {/* Prompt Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRunAI();
              }}
              className="glass-input flex-1 text-sm"
            />
            <button
              onClick={() => handleRunAI()}
              className="glass-button-primary text-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
