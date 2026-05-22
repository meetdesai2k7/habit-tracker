# Consistency - Modern Habit Tracker

Consistency is a minimal, polished, and highly interactive Habit Tracker web application built using **React**, **Vite**, and **Tailwind CSS**. It is inspired by the design principles of productivity products like Linear, Notion, and GitHub Projects: ultra-clean grays, subtle accents, keyboard efficiency, and absolute clarity.

![Consistency Habit Tracker](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80)

## Features

- **Weekly Habit Grid**: Clear horizontal columns representing 7 days of the currently viewed week, with habits aligned vertically on the left.
- **Smart Weekly Navigation**: Navigate seamlessly to previous or next weeks. Toggles on historical weeks are fully preserved, and future days are visually muted/disabled.
- **"Back to This Week" Shortcut**: Dynamically active indicator that returns the view to the current week in a single click.
- **Precise Streaks Engine**: Displays consecutive completed days. Streak count includes today (if complete) or yesterday (if today is incomplete, but yesterday is complete).
- **Interactive Inline Renaming**: Rename any habit instantly by double-clicking the title or clicking the edit icon.
- **Spreadsheet-style Keyboard Navigation**: Focus on a cell and navigate the weekly grid using Arrow keys (`↑`, `↓`, `←`, `→`). Use `Space` or `Enter` to toggle completions!
- **Persistent Data**: Automatically syncs and preserves your habit configurations, history, and theme settings to `localStorage`.
- **High-End Dark & Light Modes**: Beautiful system-preferred dark and light modes with glassmorphism and custom Linear-style scrollbars.

---

## Tech Stack

- **Core Framework**: React (v18)
- **Scaffolding/Build Tool**: Vite
- **Styling**: Tailwind CSS (v3) with Custom Config
- **Icons**: Lucide React
- **Persistence**: browser-native LocalStorage

---

## Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites

You need **Node.js** (v20+ recommended) and **npm** installed on your system.

### Installation & Run

1. Clone or navigate to the project directory:
   ```bash
   cd habit-tracker
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open the link displayed in the terminal (usually `http://localhost:5173`) in your browser.

---

## Folder Structure

```text
habit-tracker/
├── public/                # Static public assets
├── src/
│   ├── assets/            # App icons and media
│   ├── components/        # Reusable React components
│   │   ├── AddHabitForm.jsx   # Inline text input for new habits
│   │   ├── EmptyState.jsx     # Beautiful illustration for no habits
│   │   ├── HabitGrid.jsx      # Scrollable weekly grid structure
│   │   ├── HabitRow.jsx       # Individual rows, renaming, and checkbox cells
│   │   └── WeekNavigator.jsx  # Week navigation buttons
│   ├── utils/             # Helper utility functions
│   │   ├── dates.js           # Week generation, relative checkers, and formats
│   │   └── streaks.js         # Current and maximum streak calculators
│   ├── App.jsx            # Central state, localStorage syncing, and layout
│   ├── index.css          # Tailwind directives, custom scrollbars, and keyframes
│   └── main.jsx           # Application entrypoint
├── tailwind.config.js     # Custom animations, shadows, and theme colors
├── postcss.config.js      # PostCSS processors configuration
├── package.json           # Scripts and dependencies manifests
└── README.md              # Documentation
```

---

## Keyboard Controls

Enhance your productivity using our custom keyboard controls:

| Key | Action |
|---|---|
| **`Double-Click`** | Rename habit inline |
| **`Tab`** | Focus on cells or buttons |
| **`Arrow Keys (↑ ↓ ← →)`** | Move cell focus across the habit grid |
| **`Space`** or **`Enter`** | Toggle habit completion status on focused cell |
| **`Escape`** | Cancel inline renaming |

---

## License

This project is open-source and available under the [MIT License](LICENSE).
