# Answers & Architectural Decisions

This document outlines the core technical design, architectural decisions, and UX patterns adopted for the Habit Tracker application.

---

## 1. Core Architectural Decisions

### A. Flat & Time-Independent State Structure
Instead of representing week-by-week records inside isolated array blocks, we represent all habit completion statuses inside a single flat `history` map:
```typescript
interface Habit {
  id: string;
  name: string;
  createdAt: string; // ISO string
  history: Record<string, boolean>; // 'YYYY-MM-DD' -> true/false
}
```

* **Rationale**: By using `'YYYY-MM-DD'` (local date keys) as map keys, the historical data is entirely decoupled from how the week is rendered. It allows the user to browse backward and forward in time infinitely, while ensuring that checkmarks are 100% preserved. It also makes toggling a single checkmark an $O(1)$ state modification.

### B. High-Performance Keyboard Grid Navigation
We implemented spreadsheet-like Arrow Key cell navigation (`↑`, `↓`, `←`, `→`) directly within the grid:
* **Implementation Details**: We bind a single `onKeyDown` listener to the grid container (Event Delegation). Each checkbox button carries `data-grid-row={rowIndex}` and `data-grid-cell={colIndex}`. When an arrow key is pressed, we calculate the adjacent coordinate and execute `.focus()` on the corresponding button in the DOM.
* **Benefits**: 
  - Zero state changes during keyboard cell transitions (extremely fast HMR and fluid UX).
  - Clean accessibility integration by leveraging standard focus rings.

---

## 2. Streak Math & Integrity

### A. Current Streak
* **Formula**: Count backwards day-by-day starting from today (if today is checked) or yesterday (if today is unchecked but yesterday is checked). Stop at the first unchecked day.
* **Edge Case**: If both today and yesterday are unchecked, the current streak is `0`, even if there's a long sequence preceding it. This keeps it honest and matches standard apps like Snapchat, Duolingo, or Habitify.

### B. Maximum Streak
* **Formula**: Sort all completed dates and determine the overall bounding range (from the habit creation or the first completed day up to today). Traverse forward day-by-day, counting consecutive checked blocks, keeping track of the peak run length.

---

## 3. Responsive Touch & Grid Layout

* **Problem**: A grid containing 7 checkboxes plus habit names is too wide for mobile screens (360px). Scaling down checkboxes results in tap targets smaller than 44x44px, which violates mobile accessibility guidelines.
* **Solution**:
  1. We enable horizontal scroll on the outer container (`overflow-x-auto`).
  2. We keep the left habit details column sticky (`sticky left-0 z-10 bg-white/95`) so that the name of the habit is always visible when scrolling horizontally through dates.
  3. We apply `min-w-max` to prevent columns from wrapping or squishing.
  4. Checkbox targets are maintained at a comfortable, touch-friendly size ($36 \times 36 \text{px}$ with a outer padding cell of $56 \times 80 \text{px}$).

---

## 4. Suggested Git Commit Structure

To maintain a clean and reviewable history, we recommend structuring your commits as follows:

1. **`feat: initialize project scaffolding and setup tailwind`**
   - Create directories, configurations, and core dependencies.
2. **`feat: add core utility layer for date ranges and streak math`**
   - Implement `dates.js` and `streaks.js` with comprehensive checks.
3. **`feat: build reusable navigation, empty, and form components`**
   - Create `WeekNavigator.jsx`, `EmptyState.jsx`, and `AddHabitForm.jsx`.
4. **`feat: implement interactive habit grid and sticky rows`**
   - Build `HabitGrid.jsx` and `HabitRow.jsx` with rename/delete and toggle handlers.
5. **`feat: integrate keyboard cell navigation and persistence in App.jsx`**
   - Wire central hooks, localStorage sync, and Arrow Key grid traversal.
6. **`style: apply premium dark-mode styles, scrollbars and checkbox pops`**
   - Refine `index.css` transitions, custom scrollbars, and aesthetic layout details.

---

## 5. Deployment Steps for Vercel

Vercel detects Vite applications automatically and configures optimal production build pipelines.

### Option A: Vercel CLI (Fastest Local Deploy)
1. Install Vercel globally:
   ```bash
   npm install -g vercel
   ```
2. Run the deployment command inside the root folder:
   ```bash
   vercel
   ```
3. Complete the interactive setup:
   - *Set up and deploy?* **Yes**
   - *Link to existing project?* **No**
   - *What's your project's name?* **consistency-habit-tracker**
   - *In which directory is your code located?* **./**
   - *Want to modify settings?* **No** (Vite default presets work perfectly)
4. For production launch, deploy with:
   ```bash
   vercel --prod
   ```

### Option B: GitHub Integration (Continuous Deployment)
1. Push the repository to GitHub.
2. Log in to the [Vercel Dashboard](https://vercel.com).
3. Click **Add New** > **Project** and select your GitHub repository.
4. Keep the default presets:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Vercel will automatically build and re-deploy every time you push to your main branch!
