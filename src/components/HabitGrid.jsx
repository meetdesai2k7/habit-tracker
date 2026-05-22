import React from 'react';
import { HabitRow } from './HabitRow';
import { toDateKey, formatWeekday, formatDayNumber, isToday } from '../utils/dates';

/**
 * HabitGrid - Layout structure containing headers and rows. 
 * Implements sticky columns, scroll handling, and spreadsheet-style arrow key grid navigation.
 */
export const HabitGrid = ({ 
  habits, 
  dates, 
  onToggleDate, 
  onRename, 
  onDelete 
}) => {

  // Spreadsheet-style arrow key navigation inside the grid
  const handleKeyDown = (e) => {
    const active = document.activeElement;
    if (!active || !active.hasAttribute('data-grid-cell')) return;

    const currentCol = parseInt(active.getAttribute('data-grid-cell'), 10);
    // Find the row containing this button
    const rowEl = active.closest('[data-grid-row]');
    if (!rowEl) return;

    const currentRow = parseInt(rowEl.getAttribute('data-grid-row'), 10);
    let targetRow = currentRow;
    let targetCol = currentCol;

    switch (e.key) {
      case 'ArrowLeft':
        targetCol = Math.max(0, currentCol - 1);
        e.preventDefault();
        break;
      case 'ArrowRight':
        targetCol = Math.min(6, currentCol + 1);
        e.preventDefault();
        break;
      case 'ArrowUp':
        targetRow = Math.max(0, currentRow - 1);
        e.preventDefault();
        break;
      case 'ArrowDown':
        targetRow = Math.min(habits.length - 1, currentRow + 1);
        e.preventDefault();
        break;
      default:
        return; // Let other keys through (Space, Enter, etc.)
    }

    // Locate target button in the DOM
    const targetRowEl = document.querySelector(`[data-grid-row="${targetRow}"]`);
    if (targetRowEl) {
      const targetBtn = targetRowEl.querySelector(`[data-grid-cell="${targetCol}"]`);
      if (targetBtn) {
        targetBtn.focus();
      }
    }
  };

  return (
    <div 
      className="relative rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-950 shadow-sm transition-all duration-200"
      onKeyDown={handleKeyDown}
    >
      {/* Scrollable Container with custom-scrollbar */}
      <div className="overflow-x-auto custom-scrollbar grid-container">
        <div className="min-w-max flex flex-col">
          
          {/* Header Row */}
          <div className="flex border-b border-zinc-200 bg-zinc-50/75 dark:border-zinc-850 dark:bg-zinc-900/40 backdrop-blur-sm select-none">
            
            {/* Sticky Left Top Corner */}
            <div className="sticky left-0 z-20 flex w-72 shrink-0 items-center border-r border-zinc-200 bg-zinc-50/90 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/90 sticky-shadow">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Habits & Routines
              </span>
            </div>

            {/* Days Column Headers */}
            <div className="flex">
              {dates.map((date) => {
                const isTod = isToday(date);
                const dayStr = formatWeekday(date);
                const dayNum = formatDayNumber(date);

                return (
                  <div
                    key={toDateKey(date)}
                    className={`relative flex h-16 w-20 flex-col items-center justify-center border-r border-zinc-100 dark:border-zinc-900/40 ${
                      isTod 
                        ? 'bg-brand-500/[0.04] dark:bg-brand-500/[0.03] border-l border-r border-brand-500/20 dark:border-l-brand-500/10 dark:border-r-brand-500/10' 
                        : ''
                    }`}
                  >
                    {/* Pulsing indicator dot for today */}
                    {isTod && (
                      <span className="absolute top-1.5 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
                      </span>
                    )}

                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      isTod ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-400 dark:text-zinc-500'
                    }`}>
                      {dayStr}
                    </span>
                    
                    <span className={`mt-0.5 text-xs font-extrabold ${
                      isTod 
                        ? 'flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow-brand shadow-brand-600/20 dark:bg-brand-500' 
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {dayNum}
                    </span>

                    {/* Today bottom indicator accent line */}
                    {isTod && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-500 dark:bg-brand-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habit Rows */}
          <div className="flex flex-col">
            {habits.map((habit, rowIndex) => (
              <div 
                key={habit.id} 
                data-grid-row={rowIndex}
                className="grid-cell-snap"
              >
                <HabitRow
                  habit={habit}
                  dates={dates}
                  onToggleDate={onToggleDate}
                  onRename={onRename}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

