/**
 * Date manipulation utilities for the Habit Tracker grid.
 */

/**
 * Returns a new Date object representing the start of the day (00:00:00.000).
 * This prevents time offset bugs during comparison.
 */
export const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Generates an array of 7 Date objects representing Monday through Sunday
 * for the week containing the pivotDate.
 */
export const getWeekDates = (pivotDate) => {
  const pivot = startOfDay(pivotDate);
  const day = pivot.getDay();
  // Adjust so that Monday is index 0. If Sunday (0), it needs to subtract 6 days.
  const diff = pivot.getDate() - day + (day === 0 ? -6 : 1);
  
  const monday = new Date(pivot);
  monday.setDate(diff);
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    dates.push(nextDay);
  }
  return dates;
};

/**
 * Formats a Date object into a standard 'YYYY-MM-DD' key for database/localStorage mapping.
 */
export const toDateKey = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Formats a Date object into a short day label (e.g. "Mon", "Tue").
 */
export const formatWeekday = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Formats a Date object to just its day number (e.g. "22").
 */
export const formatDayNumber = (date) => {
  return date.getDate();
};

/**
 * Formats the current viewed week range (e.g. "May 18 – 24, 2026" or "Dec 29, 2025 – Jan 4, 2026")
 */
export const formatWeekRange = (dates) => {
  if (!dates || dates.length === 0) return '';
  const first = dates[0];
  const last = dates[6];
  
  const firstMonth = first.toLocaleDateString('en-US', { month: 'short' });
  const lastMonth = last.toLocaleDateString('en-US', { month: 'short' });
  const firstYear = first.getFullYear();
  const lastYear = last.getFullYear();
  
  if (firstYear !== lastYear) {
    return `${firstMonth} ${first.getDate()}, ${firstYear} – ${lastMonth} ${last.getDate()}, ${lastYear}`;
  }
  
  if (firstMonth !== lastMonth) {
    return `${firstMonth} ${first.getDate()} – ${lastMonth} ${last.getDate()}, ${firstYear}`;
  }
  
  return `${firstMonth} ${first.getDate()} – ${last.getDate()}, ${firstYear}`;
};

/**
 * Returns true if the date is exactly today.
 */
export const isToday = (date) => {
  return toDateKey(date) === toDateKey(new Date());
};

/**
 * Returns true if the date is in the future.
 */
export const isFuture = (date) => {
  const d = startOfDay(date);
  const today = startOfDay(new Date());
  return d.getTime() > today.getTime();
};
