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

# ANSWERS.md

## 1. How to run

### Local Setup

Clone the repository:

```bash
git clone https://github.com/meetdesai2k7/habit-tracker.git
```

Navigate into the project:

```bash
cd habit-tracker
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open in browser:

```txt
http://localhost:5173
```

### Live Deployment

https://habit-tracker-jet-iota.vercel.app/

---

# 2. Stack & design choices

I chose React + Vite + Tailwind CSS because the application is highly interactive and state-driven. React made it easier to manage habits, week navigation, streak calculations, and persistence through reusable components and hooks. Vite kept development fast and lightweight, while Tailwind CSS helped quickly build a responsive and consistent UI.

I decided to start the week on Monday because most productivity and planning tools use Monday-first layouts, making weekly patterns easier to scan.

One important UI decision was keeping the weekly grid horizontally scrollable on mobile screens instead of shrinking the cells. Compressing the grid reduced readability and made touch interactions uncomfortable, so horizontal scrolling preserved comfortable tap targets and visual clarity.

Another design decision was visually highlighting today’s column using a subtle accent background and border. Since habit trackers rely heavily on quick scanning, this helps users immediately focus on the current day without making the interface visually overwhelming.

For streak calculation, the current streak counts consecutive completed days up to today, or up to yesterday if today is not yet completed. This felt more natural because users should not instantly lose visible progress early in the day before completing a habit.

---

# 3. Responsive & accessibility

The app adapts differently across screen sizes instead of simply shrinking the layout.

On smaller screens (around 360px):
- the weekly grid becomes horizontally scrollable
- habit names remain visible using sticky positioning
- touch targets remain comfortable for tapping
- spacing is preserved for readability

On larger screens (1440px and above):
- the layout expands with more whitespace
- the grid becomes easier to scan visually
- hover states and interactions improve desktop usability

One accessibility improvement I implemented was keyboard-friendly navigation and visible focus states for interactive elements like buttons and checkboxes. I also added aria-labels to improve screen reader support.

One accessibility improvement I knowingly skipped was advanced screen reader announcements for dynamic streak updates and week transitions. Given the time constraints, I prioritized layout clarity, responsiveness, and keyboard accessibility first.

---

# 4. AI usage

I used AI tools during development mainly to accelerate UI ideation and frontend structuring.

Tools used:
- Antigravity
- ChatGPT

AI helped with:
- initial React + Tailwind project scaffolding
- responsive layout ideas
- component organization
- interaction polish suggestions
- accessibility suggestions

I manually reviewed and refined the generated output rather than using it unchanged.

One example was the mobile layout behavior. The initial generated version compressed the weekly grid too aggressively on small screens, making interactions feel cramped. I changed the implementation to use horizontal scrolling while preserving larger tap targets and readable spacing.

I also simplified some generated styling choices to reduce visual clutter and improve information hierarchy so the interface felt calmer and easier to scan.

Additionally, I manually reviewed the streak logic and localStorage persistence behavior to ensure consistency during reloads and week navigation.

---

# 5. Honest gap

One area that still needs improvement is long-term habit analytics and organization. While the weekly tracking experience is functional and polished, users currently cannot reorder habits or view long-term progress trends.

With another day, I would improve this by:
- adding drag-and-drop habit reordering
- implementing lightweight analytics or progress summaries
- refining transition animations between weeks
- improving screen reader support further
- adding optional dark mode support

I would also spend more time polishing micro-interactions and refining motion consistency across the interface.
   - Refine `index.css` transitions, custom scrollbars, and aesthetic layout details.

