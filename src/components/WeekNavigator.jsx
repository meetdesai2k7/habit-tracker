import React from 'react';
import { ChevronLeft, ChevronRight, CalendarRange } from 'lucide-react';
import { formatWeekRange, toDateKey } from '../utils/dates';

/**
 * WeekNavigator - Clean controls to slide between weeks.
 */
export const WeekNavigator = ({ 
  dates, 
  onPrevWeek, 
  onNextWeek, 
  onResetWeek,
  isCurrentWeek 
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
      {/* Date display range with glassmorphism layout */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-zinc-200/80 text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
          <CalendarRange className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Viewed Interval</span>
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 tracking-tight">
            {formatWeekRange(dates)}
          </h2>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {!isCurrentWeek && (
          <button
            onClick={onResetWeek}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-50 hover:text-zinc-900 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 dark:hover:text-zinc-100 active:scale-[0.98] animate-fade-in focus-visible:ring-brand-500"
            aria-label="Back to current week"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Back to this week
          </button>
        )}
        
        <div className="flex items-center rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900/80 shadow-sm">
          <button
            onClick={onPrevWeek}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-150 active:scale-[0.9] focus-visible:ring-brand-500"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          
          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
          
          <button
            onClick={onNextWeek}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-150 active:scale-[0.9] focus-visible:ring-brand-500"
            aria-label="Next week"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
