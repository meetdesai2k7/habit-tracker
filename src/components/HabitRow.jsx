import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Check, Flame } from 'lucide-react';
import { toDateKey, isToday, isFuture } from '../utils/dates';
import { calculateStreak } from '../utils/streaks';

/**
 * HabitRow - Represents one habit, its operations, and its weekly completion checkboxes.
 */
export const HabitRow = ({ 
  habit, 
  dates, 
  onToggleDate, 
  onRename, 
  onDelete,
  onCellFocus 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(habit.name);
  const editInputRef = useRef(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleRenameSubmit = () => {
    const trimmed = newName.trim();
    if (trimmed && trimmed !== habit.name) {
      onRename(habit.id, trimmed);
    } else {
      setNewName(habit.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setNewName(habit.name);
      setIsEditing(false);
    }
  };

  // Calculate streaks
  const { currentStreak, maxStreak } = calculateStreak(habit.history, habit.createdAt);

  // Render high-fidelity consistency flame pill badges
  const renderStreakBadge = () => {
    if (currentStreak === 0) {
      return (
        <div className="flex items-center gap-1 rounded-full bg-zinc-100/70 px-2 py-0.5 text-[10px] font-semibold text-zinc-400 dark:bg-zinc-900/70 dark:text-zinc-500 border border-zinc-200/20 dark:border-zinc-800/20">
          <Flame className="h-3 w-3 text-zinc-300 dark:text-zinc-650" />
          <span>0d streak</span>
        </div>
      );
    }

    if (currentStreak >= 5) {
      return (
        <div className="relative flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-orange-500/15 border border-orange-400/20 animate-pulse">
          <Flame className="h-3 w-3 fill-white" />
          <span>{currentStreak}d streak 🔥</span>
        </div>
      );
    }

    if (currentStreak >= 3) {
      return (
        <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-200/40 dark:border-orange-900/30">
          <Flame className="h-3 w-3 fill-orange-500/10" />
          <span>{currentStreak}d streak</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/40 dark:border-amber-900/30">
        <Flame className="h-3 w-3 fill-amber-500/10" />
        <span>{currentStreak}d streak</span>
      </div>
    );
  };

  return (
    <div className="group flex min-w-max border-b border-zinc-100 hover:bg-zinc-50/50 dark:border-zinc-900 dark:hover:bg-zinc-950/10 transition-colors duration-150">
      
      {/* Sticky Left Column: Habit details with seamless group hover match background */}
      <div className="sticky left-0 z-10 flex w-72 shrink-0 items-center justify-between border-r border-zinc-200 bg-white px-4 py-3.5 transition-colors duration-150 dark:border-zinc-800 dark:bg-zinc-950 group-hover:bg-zinc-50/50 dark:group-hover:bg-zinc-950/80 sticky-shadow">
        <div className="flex flex-1 items-center gap-2 overflow-hidden mr-2">
          {isEditing ? (
            <input
              ref={editInputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              className="w-full rounded-lg border border-brand-500 bg-white px-2.5 py-1 text-sm text-zinc-900 outline-none ring-2 ring-brand-100/50 dark:border-brand-500 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-brand-950/40"
              maxLength={60}
            />
          ) : (
            <div className="flex flex-col min-w-0">
              <span 
                onDoubleClick={() => setIsEditing(true)}
                className="cursor-pointer truncate text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-zinc-50 select-none transition-colors duration-150"
                title="Double click to rename"
              >
                {habit.name}
              </span>
              
              {/* Streak pill indicator + max streak text */}
              <div className="flex items-center gap-2.5 mt-1.5 select-none">
                {renderStreakBadge()}
                {maxStreak > 0 && (
                  <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-650">
                    max {maxStreak}d
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons (Rename, Delete) - Visible on row hover and fully accessible */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors duration-150 dark:text-zinc-600 dark:hover:bg-zinc-900 dark:hover:text-zinc-355"
            title="Rename Habit"
            aria-label={`Rename ${habit.name}`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          
          <button
            onClick={() => onDelete(habit.id)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-650 transition-colors duration-150 dark:text-zinc-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
            title="Delete Habit"
            aria-label={`Delete ${habit.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Right Grid Column: 7 week checkboxes */}
      <div className="flex">
        {dates.map((date, index) => {
          const dateKey = toDateKey(date);
          const isCompleted = !!habit.history[dateKey];
          const isFut = isFuture(date);
          const isTod = isToday(date);

          return (
            <div
              key={dateKey}
              className={`flex h-16 w-20 items-center justify-center border-r border-zinc-100 dark:border-zinc-900/40 transition-colors duration-150 ${
                isTod ? 'bg-brand-50/10 dark:bg-brand-950/3' : ''
              }`}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={isCompleted}
                aria-disabled={isFut}
                onClick={() => {
                  if (!isFut) {
                    onToggleDate(habit.id, dateKey);
                  }
                }}
                onFocus={(e) => onCellFocus && onCellFocus(index, e)}
                data-grid-cell={index}
                className={`group/cell relative flex h-10 w-10 items-center justify-center rounded-xl border outline-none transition-all duration-200 ${
                  isFut 
                    ? 'cursor-not-allowed border-zinc-150/70 bg-zinc-50/40 text-zinc-200 dark:border-zinc-900/60 dark:bg-zinc-950/10 dark:text-zinc-800' 
                    : isCompleted
                      ? 'border-success-500 bg-success-500 text-white shadow-glow-success shadow-success-500/25 active:scale-95'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-100/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:focus:border-brand-500 dark:focus:ring-brand-950/50 active:scale-95'
                }`}
                aria-label={`${isCompleted ? 'Complete' : 'Incomplete'} on ${dateKey}`}
              >
                {isCompleted && (
                  <Check className="h-5.5 w-5.5 stroke-[3.5] animate-check-pop" />
                )}
                
                {!isCompleted && !isFut && (
                  <span className="opacity-0 group-hover/cell:opacity-100 transition-opacity duration-150">
                    <Check className="h-4.5 w-4.5 text-zinc-300 dark:text-zinc-700 stroke-[3]" />
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

