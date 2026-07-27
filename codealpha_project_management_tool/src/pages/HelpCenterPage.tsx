import React, { useState } from 'react';
import { 
  HelpCircle, 
  Command, 
  BookOpen, 
  MessageSquare, 
  Send, 
  ChevronDown, 
  CheckCircle2,
  Search,
  Zap,
  Users,
  FolderKanban,
  CheckSquare,
  FileText
} from 'lucide-react';

export const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const guideCategories = [
    { title: 'Getting Started', description: 'Platform onboarding & quick start guide', icon: <Zap className="w-5 h-5 text-amber-400" /> },
    { title: 'Managing Projects', description: 'Workspaces, custom columns & WIP limits', icon: <FolderKanban className="w-5 h-5 text-purple-400" /> },
    { title: 'Creating Tasks', description: 'Task cards, checklists, subtasks & AI tags', icon: <CheckSquare className="w-5 h-5 text-cyan-400" /> },
    { title: 'Inviting Team Members', description: 'IAM permissions, roles & workspace access', icon: <Users className="w-5 h-5 text-emerald-400" /> },
  ];

  const popularArticles = [
    { title: 'Setting up Socket.io Realtime Collaboration Sync', views: '2,480 reads', category: 'Architecture' },
    { title: 'Configuring WebGL Glassmorphism Shader Settings', views: '1,920 reads', category: 'UI Customization' },
    { title: 'Exporting Sprint Velocity & Burndown Charts to PDF', views: '1,450 reads', category: 'Analytics' },
    { title: 'Zero Trust Authentication & OAuth2 Provider Setup', views: '1,120 reads', category: 'Security' }
  ];

  const shortcuts = [
    { key: '⌘ + K', description: 'Open In-Navbar Global Command & Search' },
    { key: '⌘ + N', description: 'Quick New Task Modal' },
    { key: '⌘ + Shift + P', description: 'Create New Project' },
    { key: 'Esc', description: 'Dismiss Floating Popovers & Windows' },
  ];

  const faqs = [
    {
      q: 'How does Aether AI Copilot estimate task completion time?',
      a: 'Aether AI analyzes historical sprint durations, complexity keywords in task descriptions, contributor velocity, and open subtasks to generate precise estimated hours.'
    },
    {
      q: 'Can I export project data and analytics reports?',
      a: 'Yes! Navigate to Platform Settings or Analytics to export task data in CSV, Excel, or PDF report formats.'
    },
    {
      q: 'How do Socket.io real-time updates work?',
      a: 'Socket.io streams live task card state changes, comment additions, active presence pills, and cursor locations instantly without manual page refreshes.'
    },
    {
      q: 'How do I invite team members and assign custom roles?',
      a: 'Go to Team Workspace in the sidebar and click Invite Member. Enter their email and select a role (e.g. Lead Designer, Staff Architect, Systems Lead).'
    }
  ];

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setIsSent(true);
  };

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col h-full overflow-y-auto space-y-6">
      {/* Search Header Banner */}
      <div className="glass-panel p-8 space-y-4 text-center max-w-3xl mx-auto w-full">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-black text-2xl text-slate-100">How can we help you today?</h2>
          <p className="text-xs text-slate-400 mt-1">Search production guides, keyboard shortcuts, or contact 24/7 engineering support</p>
        </div>

        <div className="relative max-w-lg mx-auto">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles..."
            className="glass-input pl-10 w-full text-xs py-2.5"
          />
        </div>
      </div>

      {/* Guide Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {guideCategories.map((cat) => (
          <div key={cat.title} className="glass-card p-5 space-y-2 cursor-pointer">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 w-fit">
              {cat.icon}
            </div>
            <h3 className="font-bold text-sm text-slate-100">{cat.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Documentation Articles & FAQs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Popular Articles */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Popular Articles & Tutorials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {popularArticles.map((art) => (
                <div key={art.title} className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all space-y-1 cursor-pointer">
                  <span className="text-[9px] font-mono text-purple-300 font-bold px-1.5 py-0.2 rounded bg-purple-500/20">
                    {art.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-200 hover:text-white truncate mt-1">
                    {art.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">{art.views}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard Shortcuts Cheatsheet */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Command className="w-4 h-4 text-cyan-400" />
              <span>Keyboard Shortcuts Cheatsheet</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shortcuts.map((sc) => (
                <div key={sc.key} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">{sc.description}</span>
                  <kbd className="px-2 py-1 rounded bg-slate-800 text-purple-300 font-mono font-bold text-[10px] border border-white/10">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                  </div>
                  {activeFaq === index && (
                    <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Support Ticket Box */}
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-pink-400" />
              <span>Contact Engineering Support</span>
            </h3>

            {isSent ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-xs text-emerald-200">Ticket Submitted</h4>
                <p className="text-[11px] text-slate-300">Our engineering support team will reply to your email within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSendSupport} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={supportName}
                  onChange={(e) => setSupportName(e.target.value)}
                  className="glass-input w-full text-xs"
                />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="glass-input w-full text-xs"
                />
                <input
                  type="text"
                  placeholder="Enter the subject"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className="glass-input w-full text-xs"
                />
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue or question"
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="glass-input w-full text-xs"
                />
                <button type="submit" className="glass-button-primary text-xs w-full justify-center">
                  <Send className="w-4 h-4" />
                  <span>Submit Support Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
