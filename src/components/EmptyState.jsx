import React from 'react';
import { Sparkles, Calendar, Plus } from 'lucide-react';

/**
 * EmptyState - A gorgeous empty state component inspired by Linear.
 */
export const EmptyState = ({ onCreateDefault }) => {
  const defaults = [
    { name: 'drink 3L water', icon: '💧' },
    { name: 'read 15 pages', icon: '📚' },
    { name: 'meditate 10m', icon: '🧘' },
    { name: 'exercise 30m', icon: '🏃' },
  ];

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950/30 animate-fade-in py-16">
      
      {/* Premium layered icon container with brand glow */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 text-brand-500 shadow-glow-brand dark:bg-zinc-900/60 dark:border-zinc-800/80 dark:text-brand-400">
        <Calendar className="h-7 w-7" />
        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] text-white shadow dark:bg-brand-500">
          <Sparkles className="h-2.5 w-2.5 fill-white/10" />
        </div>
      </div>
      
      <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Your new routines start here
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        Consistency is built step-by-step. Add a custom habit using the input bar above, or choose one of our curated daily suggestions to instantly build momentum:
      </p>

      {/* Suggested Quick Starts - Sleek minimalist pill badges */}
      <div className="mt-8 flex flex-wrap justify-center gap-2.5 max-w-md">
        {defaults.map((habit) => (
          <button
            key={habit.name}
            type="button"
            onClick={() => onCreateDefault(habit.name)}
            className="group flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/30 hover:bg-brand-50/10 hover:text-zinc-900 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-brand-500/20 dark:hover:bg-brand-950/10 dark:hover:text-zinc-100 active:scale-[0.98]"
            aria-label={`Add suggestion: ${habit.name}`}
          >
            <span className="text-sm select-none transition-transform duration-200 group-hover:scale-110">{habit.icon}</span>
            <span>{habit.name}</span>
            <Plus className="h-3.5 w-3.5 text-zinc-400 group-hover:text-brand-500 dark:text-zinc-500 dark:group-hover:text-brand-400 transition-colors duration-150" />
          </button>
        ))}
      </div>
    </div>
  );
};
