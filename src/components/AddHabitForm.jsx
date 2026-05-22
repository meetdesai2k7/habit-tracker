import React, { useState } from 'react';
import { Plus } from 'lucide-react';

/**
 * AddHabitForm - Premium, high-fidelity inline form to add a new habit.
 */
export const AddHabitForm = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
  };

  const isFormEmpty = !name.trim();

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex w-full items-center gap-3 animate-fade-in"
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Create a new habit (e.g. Read for 20 mins, Drink 3L water)..."
          className="w-full rounded-xl border border-zinc-200/90 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400/80 shadow-sm outline-none transition-all duration-200 hover:border-zinc-300 hover:shadow focus:border-brand-500 focus:shadow-glow-brand focus:ring-2 focus:ring-brand-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-600 dark:hover:border-zinc-700 dark:focus:border-brand-500 dark:focus:ring-brand-950/50"
          aria-label="Habit name"
        />
        {/* Subtle right-side character/status indicator */}
        {name.trim().length > 0 && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-[10px] text-zinc-400 font-mono dark:text-zinc-500 select-none animate-fade-in">
            {name.length}/60
          </div>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isFormEmpty}
        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-brand-500 hover:to-indigo-500 hover:shadow-md hover:shadow-brand-500/10 active:translate-y-0 active:scale-[0.97] active:from-brand-700 active:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:pointer-events-none disabled:bg-zinc-100 disabled:from-zinc-100 disabled:to-zinc-100 disabled:text-zinc-400 disabled:shadow-none dark:from-brand-500 dark:to-indigo-500 dark:hover:from-brand-400 dark:hover:to-indigo-400 dark:focus:ring-offset-zinc-950 dark:disabled:bg-zinc-800/40 dark:disabled:from-zinc-800/40 dark:disabled:to-zinc-800/40 dark:disabled:text-zinc-650"
        aria-label="Add new habit"
      >
        <Plus className="h-4 w-4 stroke-[2.5]" />
        <span className="hidden sm:inline">Add Habit</span>
      </button>
    </form>
  );
};

