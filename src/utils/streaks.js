import { toDateKey, startOfDay } from './dates';

/**
 * Calculates both the current and maximum historical streak for a habit.
 * 
 * Rules:
 * 1. Current streak counts consecutive completed days up to today.
 * 2. If today is incomplete, the current streak continues from yesterday (if completed).
 *    If both are incomplete, current streak is 0.
 * 3. Max streak is the longest consecutive run of completed days ever.
 * 
 * @param {Record<string, boolean>} history - Map of 'YYYY-MM-DD' keys to completion status (true/false)
 * @param {string} createdAtStr - ISO string or 'YYYY-MM-DD' representing when the habit was created
 * @returns {{ currentStreak: number, maxStreak: number }}
 */
export const calculateStreak = (history = {}, createdAtStr) => {
  const today = startOfDay(new Date());
  const todayKey = toDateKey(today);
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);
  
  // ----------------------------------------------------
  // 1. Calculate Current Streak (Backwards from today/yesterday)
  // ----------------------------------------------------
  let currentStreak = 0;
  let checkDate = new Date(today);
  
  // Decide where to start counting the current streak backwards.
  if (history[todayKey]) {
    checkDate = new Date(today);
  } else if (history[yesterdayKey]) {
    checkDate = new Date(yesterday);
  } else {
    // Both today and yesterday are incomplete, so current streak is 0.
    checkDate = null;
  }
  
  if (checkDate) {
    while (true) {
      const key = toDateKey(checkDate);
      if (history[key]) {
        currentStreak++;
        // Go back one day
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }
  
  // ----------------------------------------------------
  // 2. Calculate Maximum Streak (Forward traversal)
  // ----------------------------------------------------
  let maxStreak = 0;
  let tempStreak = 0;
  
  // Get all keys that are completed (true)
  const completedKeys = Object.keys(history).filter(key => history[key] === true);
  
  if (completedKeys.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }
  
  // Sort completed dates to find the start and end of the record range
  const completedDates = completedKeys.map(k => new Date(k + 'T00:00:00')).sort((a, b) => a - b);
  
  const firstCompleted = completedDates[0];
  const lastCompleted = completedDates[completedDates.length - 1];
  
  // Also factor in the habit's creation date to ensure we don't start before it was made
  let startDate = new Date(firstCompleted);
  if (createdAtStr) {
    const createdDate = startOfDay(new Date(createdAtStr));
    if (createdDate < startDate) {
      startDate = createdDate;
    }
  }
  
  // Traverse from the start date to the latest completed date (or today, whichever is later)
  const endDate = lastCompleted > today ? lastCompleted : today;
  
  let currentTraversal = new Date(startDate);
  while (currentTraversal <= endDate) {
    const key = toDateKey(currentTraversal);
    if (history[key]) {
      tempStreak++;
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
    currentTraversal.setDate(currentTraversal.getDate() + 1);
  }
  
  return { currentStreak, maxStreak };
};
