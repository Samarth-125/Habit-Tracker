# ✦ Habit Tracker

A beautiful, feature-rich personal habit tracker built with React and Vite.

---

## Features

- **Grid View** — GitHub-style monthly grid with checkboxes for each day
- **Card View** — Clean daily card layout with streaks and progress rings
- **BAR / LINE / HEAT Charts** — Three chart types per habit
- **Streak Tracking** — Current streak, best streak, 30-day completion rate
- **Progress Ring** — Circular progress indicator per habit (30-day rate)
- **Groups / Categories** — Organize habits into color-coded groups
- **Goals / Targets** — Set monthly day targets per habit
- **Search** — Filter habits instantly
- **Daily Quote** — Famous, meme, and custom quotes rotate daily
- **Custom Quotes** — Add your own quotes with author name
- **Confetti** — Fires when you complete all habits for the day 🎊
- **Animations** — Slide in, bounce, shake, highlight, pulse, glow
- **Drag to Reorder** — Drag habits up and down in card view
- **Daily Notifications** — Browser reminder at your chosen time
- **Dark / Light Theme** — Toggle with smooth transitions
- **Export CSV** — Download all your habit data
- **Mobile Friendly** — Bottom nav bar on small screens
- **Stats Page** — Heatmap, bar chart, streak cards per habit
- **Settings Page** — Goals, groups, quotes, notifications, data
- **Profile Page** — Overview of all your stats

---

## Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Frontend     | React 18 + Vite         |
| Styling      | Tailwind CSS + CSS vars |
| Routing      | React Router v6         |
| Charts       | Custom SVG              |
| Animations   | CSS keyframes           |
| Storage      | localStorage            |
| Hosting      | Vercel                  |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/Samarth-125/Habit-Tracker.git
cd Habit-Tracker

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

---

## Folder Structure

```
src/
├── components/
│   ├── layout/        # AppLayout, Sidebar, Header
│   ├── habits/        # HabitCard, HabitForm
│   ├── stats/         # Heatmap, StreakCard, CompletionChart
│   └── ui/            # Button, Modal, Toast
├── hooks/
│   ├── useAuth.js     # Auth hook (Supabase ready)
│   ├── useHabits.js   # Habit CRUD + groups + goals
│   ├── useStreak.js   # Streak, best streak, completion rate
│   └── useTheme.js    # Dark/light theme toggle
├── lib/
│   ├── quotes.js      # Daily quotes + custom quotes
│   └── supabase.js    # Supabase client (ready to connect)
└── pages/
    ├── Dashboard.jsx  # Main habit tracking page
    ├── Stats.jsx      # Heatmap + charts + streaks
    ├── Settings.jsx   # Goals, groups, notifications, data
    ├── Profile.jsx    # User stats overview
    └── Login.jsx      # Auth page (Supabase ready)
```

---

## Design System

### Colors
| Token      | Dark          | Light         | Usage              |
|------------|---------------|---------------|--------------------|
| `--bg`     | `#0e0e10`     | `#f5f5f0`     | Page background    |
| `--surface`| `#15151a`     | `#ffffff`     | Cards              |
| `--accent` | `#c8f55a`     | `#c8f55a`     | Primary accent     |
| `--teal`   | `#5af5c8`     | `#5af5c8`     | Units, secondary   |
| `--pink`   | `#f55a8c`     | `#f55a8c`     | Today, danger      |
| `--gold`   | `#f5c85a`     | `#f5c85a`     | Goals, warnings    |

### Fonts
- **UI / Body** — DM Mono (monospace)
- **Headings** — DM Serif Display

---

## Roadmap

- [ ] Supabase auth + cloud sync
- [ ] Google OAuth login
- [ ] Custom domain
- [ ] PWA support (installable on phone)
- [ ] Weekly email summary
- [ ] Habit templates
- [ ] Archive habits

---

## License

MIT — feel free to use, modify, and share.

---

Built by Samarth