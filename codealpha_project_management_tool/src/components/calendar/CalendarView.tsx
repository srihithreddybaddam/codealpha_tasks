import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Video, 
  Flag, 
  Zap, 
  Sparkles,
  X
} from 'lucide-react';
import type { CalendarEventItem } from '../../data/mockData';

export const CalendarView: React.FC = () => {
  const { filteredTasks, setActiveTask } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 25)); // July 2026
  const [selectedDay, setSelectedDay] = useState<number>(25);
  const [events, setEvents] = useState<CalendarEventItem[]>([]);

  // Quick Add Event Modal State
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('10:00 AM');
  const [newEventType, setNewEventType] = useState<'deadline' | 'milestone' | 'meeting' | 'release'>('meeting');
  const [newEventPriority, setNewEventPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('medium');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'high': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'medium': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'low': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default: return 'bg-slate-800 text-slate-300 border-white/5';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Video className="w-3 h-3 text-cyan-400" />;
      case 'milestone': return <Flag className="w-3 h-3 text-amber-400" />;
      case 'release': return <Zap className="w-3 h-3 text-purple-400" />;
      case 'deadline':
      default: return <Clock className="w-3 h-3 text-rose-400" />;
    }
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    const dateStr = `2026-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const newEvt: CalendarEventItem = {
      id: `evt-${Date.now()}`,
      title: newEventTitle.trim(),
      date: dateStr,
      time: newEventTime,
      type: newEventType,
      projectId: 'prj-1',
      projectName: 'TaskFlow SaaS Launch',
      priority: newEventPriority,
      assigneeNames: ['Sarah Chen']
    };
    setEvents((prev) => [...prev, newEvt]);
    setNewEventTitle('');
    setIsAddEventOpen(false);
  };

  const selectedDateStr = `2026-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedDayEvents = events.filter((e) => e.date === selectedDateStr);
  const selectedDayTasks = filteredTasks.filter((t) => t.dueDate === selectedDateStr);

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col lg:flex-row gap-6 overflow-y-auto">
      {/* Main Calendar View */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Calendar Header Bar & Stats */}
        <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-purple-300">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-slate-100 flex items-center gap-2">
                <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  {events.length} Schedule Items
                </span>
              </h2>
              <p className="text-xs text-slate-400">Sprint milestones, release schedules, and team meetings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="glass-button-primary text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Add Event</span>
            </button>

            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/10 text-slate-300">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/10 text-slate-300">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid Header & Calendar Cells */}
        <div className="glass-panel p-5 flex-1 flex flex-col">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold uppercase tracking-wider text-slate-400 pb-3 border-b border-white/10">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2 flex-1 pt-3">
            {paddingArray.map((_, i) => (
              <div key={`pad-${i}`} className="min-h-[110px] rounded-2xl bg-white/[0.01] border border-transparent opacity-20" />
            ))}

            {daysArray.map((day) => {
              const dateStr = `2026-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvts = events.filter((e) => e.date === dateStr);
              const dayTsks = filteredTasks.filter((t) => t.dueDate === dateStr);
              const isToday = day === 25 && currentDate.getMonth() === 6;
              const isSelected = day === selectedDay;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[110px] p-2.5 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-purple-500/20 border-purple-400 shadow-xl shadow-purple-500/10 ring-1 ring-purple-400/50'
                      : isToday
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-mono font-extrabold w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-purple-500 text-white shadow-md'
                        : isToday
                        ? 'bg-purple-500/30 text-purple-200'
                        : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {day}
                    </span>

                    {(dayEvts.length > 0 || dayTsks.length > 0) && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {dayEvts.length + dayTsks.length}
                      </span>
                    )}
                  </div>

                  {/* Day Events Preview */}
                  <div className="space-y-1 my-1 flex-1 overflow-y-auto max-h-16 pr-0.5">
                    {dayEvts.map((e) => (
                      <div
                        key={e.id}
                        className={`p-1 rounded-lg text-[10px] font-semibold border truncate flex items-center gap-1 ${getPriorityBadge(e.priority)}`}
                        title={`${e.title} (${e.time})`}
                      >
                        {getTypeIcon(e.type)}
                        <span className="truncate">{e.title}</span>
                      </div>
                    ))}

                    {dayTsks.map((t) => (
                      <div
                        key={t.id}
                        onClick={(evt) => {
                          evt.stopPropagation();
                          setActiveTask(t);
                        }}
                        className={`p-1 rounded-lg text-[10px] font-semibold border truncate ${getPriorityBadge(t.priority)}`}
                        title={`Task: ${t.title}`}
                      >
                        <span className="truncate">📋 {t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agenda & Day Details Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        {/* Selected Day Agenda */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-100">
                Agenda for July {selectedDay}, 2026
              </h3>
              <p className="text-xs text-slate-400">
                {selectedDayEvents.length + selectedDayTasks.length} scheduled items
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              DAY {selectedDay}
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {selectedDayEvents.length === 0 && selectedDayTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                <Sparkles className="w-6 h-6 text-purple-400 mx-auto" />
                <p>No events scheduled for this day.</p>
                <button
                  onClick={() => setIsAddEventOpen(true)}
                  className="text-purple-300 font-bold hover:underline"
                >
                  + Add New Event
                </button>
              </div>
            ) : (
              <>
                {selectedDayEvents.map((e) => (
                  <div
                    key={e.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 flex items-center gap-1.5">
                        {getTypeIcon(e.type)}
                        <span>{e.title}</span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">{e.time}</span>
                    </div>
                    <p className="text-[11px] text-purple-300 font-mono">{e.projectName}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <span>Assigned to: {e.assigneeNames.join(', ')}</span>
                    </div>
                  </div>
                ))}

                {selectedDayTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setActiveTask(t)}
                    className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs space-y-1.5 cursor-pointer hover:bg-purple-500/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">📋 {t.title}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                        {t.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">{t.description}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Upcoming Week Summary */}
        <div className="glass-panel p-5 space-y-3">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 border-b border-white/10 pb-2">
            Upcoming Week Highlights
          </h4>

          <div className="space-y-2">
            {events.slice(0, 3).map((e) => (
              <div key={e.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/5 border border-white/5">
                <div className="truncate">
                  <h5 className="font-bold text-slate-200 truncate">{e.title}</h5>
                  <span className="text-[10px] text-slate-400 font-mono">{e.date} • {e.time}</span>
                </div>
                <span className="text-[10px] font-mono text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-500/20">
                  {e.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Add Event Modal */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="glass-modal w-full max-w-md p-6 space-y-4 border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-base text-slate-100">Add Event to July {selectedDay}</h3>
              <button onClick={() => setIsAddEventOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="w-full glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Time</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Type</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full glass-input bg-slate-900"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="milestone">Milestone</option>
                    <option value="deadline">Deadline</option>
                    <option value="release">Release</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Priority</label>
                <select
                  value={newEventPriority}
                  onChange={(e) => setNewEventPriority(e.target.value as any)}
                  className="w-full glass-input bg-slate-900"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button onClick={() => setIsAddEventOpen(false)} className="glass-button-secondary text-xs">
                Cancel
              </button>
              <button onClick={handleAddEvent} className="glass-button-primary text-xs">
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
