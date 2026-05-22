import React, { useState, useEffect } from 'react';
import { Sun, Moon, CheckSquare } from 'lucide-react';
import { AddHabitForm } from './components/AddHabitForm';
import { EmptyState } from './components/EmptyState';
import { WeekNavigator } from './components/WeekNavigator';
import { HabitGrid } from './components/HabitGrid';
import { getWeekDates, toDateKey } from './utils/dates';

function App() {
  // ----------------------------------------------------
  // State Management
  // ----------------------------------------------------
  
  // Load habits from localStorage
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('antigravity_habits');
    return saved ? JSON.parse(saved) : [];
  });

  // Current pivot date representing the currently viewed week
  const [pivotDate, setPivotDate] = useState(() => new Date());

  // Dark/Light theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('antigravity_theme');
    if (saved) return saved;
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // ----------------------------------------------------
  // Effects & Synchronization
  // ----------------------------------------------------
  
  // Sync habits to localStorage
  useEffect(() => {
    localStorage.setItem('antigravity_habits', JSON.stringify(habits));
  }, [habits]);

  // Sync theme to DOM & localStorage
  useEffect(() => {
    localStorage.setItem('antigravity_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // ----------------------------------------------------
  // Utilities
  // ----------------------------------------------------
  const currentWeekDates = getWeekDates(pivotDate);
  
  // Checks if the viewed week contains today
  const isCurrentWeek = currentWeekDates.some(date => {
    return toDateKey(date) === toDateKey(new Date());
  });

  // ----------------------------------------------------
  // Habit Operations
  // ----------------------------------------------------
  
  const handleAddHabit = (name) => {
    const newHabit = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name,
      createdAt: new Date().toISOString(),
      history: {},
    };
    setHabits((prev) => [newHabit, ...prev]);
  };

  const handleRenameHabit = (id, newName) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: newName } : h))
    );
  };

  const handleDeleteHabit = (id) => {
    if (window.confirm('Are you sure you want to delete this habit? All historical streak records will be lost.')) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const handleToggleDate = (habitId, dateKey) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const currentStatus = !!h.history[dateKey];
        return {
          ...h,
          history: {
            ...h.history,
            [dateKey]: !currentStatus,
          },
        };
      })
    );
  };

  const handleCreateDefaultHabit = (name) => {
    handleAddHabit(name);
  };

  // ----------------------------------------------------
  // Week Navigation Operations
  // ----------------------------------------------------
  
  const handlePrevWeek = () => {
    setPivotDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  const handleNextWeek = () => {
    setPivotDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  const handleResetWeek = () => {
    setPivotDate(new Date());
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen relative bg-zinc-50/50 font-sans text-zinc-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100">
      
      {/* Background radial dots pattern (Linear style) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-60 pointer-events-none" />

      {/* Top Navigation / Header */}
      <header className="border-b border-zinc-200 bg-white/70 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/70 sticky top-0 z-40 select-none">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-glow-brand shadow-brand-500/20">
              <CheckSquare className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Consistency
              </h1>
              <p className="text-[10px] font-semibold text-brand-500 dark:text-brand-400 tracking-wide uppercase">
                Daily Habit Tracker
              </p>
            </div>
          </div>

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-50 hover:text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 active:scale-95 focus-visible:ring-brand-500"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative mx-auto max-w-5xl px-4 py-8 flex flex-col gap-6">
        
        {/* Unified workspace controls - Glassmorphism container */}
        <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white px-5 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 backdrop-blur-sm">
          
          <WeekNavigator
            dates={currentWeekDates}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onResetWeek={handleResetWeek}
            isCurrentWeek={isCurrentWeek}
          />
          
          <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800/80 w-full" />
          
          <div className="max-w-xl">
            <AddHabitForm onAdd={handleAddHabit} />
          </div>
        </div>

        {/* Content Body: Empty State or Grid */}
        <div className="flex flex-col gap-4">
          {habits.length === 0 ? (
            <EmptyState onCreateDefault={handleCreateDefaultHabit} />
          ) : (
            <div className="animate-fade-in flex flex-col gap-3">
              <HabitGrid
                habits={habits}
                dates={currentWeekDates}
                onToggleDate={handleToggleDate}
                onRename={handleRenameHabit}
                onDelete={handleDeleteHabit}
              />
              
              {/* High-Fidelity Keyboard Guidance & Legend Footer */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[11px] text-zinc-400 dark:text-zinc-550 px-1.5 py-1 select-none">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                  Double-click a habit name to rename inline.
                </span>
                <span className="hidden sm:flex items-center gap-1.5">
                  <span>Use keys</span>
                  <div className="flex items-center gap-1">
                    <kbd className="inline-flex h-5 items-center justify-center rounded border border-zinc-200 bg-white px-1.5 text-[9px] font-bold text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">↑</kbd>
                    <kbd className="inline-flex h-5 items-center justify-center rounded border border-zinc-200 bg-white px-1.5 text-[9px] font-bold text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">↓</kbd>
                    <kbd className="inline-flex h-5 items-center justify-center rounded border border-zinc-200 bg-white px-1.5 text-[9px] font-bold text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">←</kbd>
                    <kbd className="inline-flex h-5 items-center justify-center rounded border border-zinc-200 bg-white px-1.5 text-[9px] font-bold text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">→</kbd>
                  </div>
                  <span>to navigate,</span>
                  <kbd className="inline-flex h-5 items-center justify-center rounded border border-zinc-200 bg-white px-1.5 text-[9px] font-bold text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">Space</kbd>
                  <span>or</span>
                  <kbd className="inline-flex h-5 items-center justify-center rounded border border-zinc-200 bg-white px-1.5 text-[9px] font-bold text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">Enter</kbd>
                  <span>to toggle days.</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

