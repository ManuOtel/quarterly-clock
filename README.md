# Quarter Clock

A lightweight, privacy-focused web app for tracking projects within quarterly timeframes. No accounts, no servers, no tracking—your data stays in your browser.

## Features

- **Quarter Progress Tracking** — See how far along the current quarter you are (Q1–Q4)
- **Project Management** — Create projects with deadlines and subtasks
- **Progress Visualization** — Track completion percentage and time remaining
- **Status Indicators** — Know if you're on track, ahead, or behind schedule
- **100% Local Storage** — All data stored in your browser's localStorage
- **Export/Import** — Back up your data as JSON anytime

## Tech Stack

- [Svelte 5](https://svelte.dev/) — Reactive UI framework
- [Vite](https://vite.dev/) — Build tool and dev server
- No backend, no database, no dependencies beyond the essentials

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/ManuOtel/quarterly-clock
cd quarter-clock

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output is in the `dist/` folder—static files ready to deploy anywhere.

## How It Works

### Quarter Calculations

- **Q1**: January 1 – March 31
- **Q2**: April 1 – June 30
- **Q3**: July 1 – September 30
- **Q4**: October 1 – December 31

The app calculates progress as: `(days elapsed / total days in quarter) × 100`

### Project Status

Projects are marked as:

- **On Track** — Completion % matches or exceeds expected progress based on time elapsed
- **Behind** — Completion % is lower than expected given the timeline
- **Ahead** — Completion % exceeds expected progress

### Data Storage

All data lives in `localStorage` as JSON:

```json
{
  "projects": [
    {
      "id": "unique-id",
      "name": "Project Name",
      "deadline": "2026-03-31",
      "subtasks": [
        {
          "id": "unique-id",
          "description": "Task description",
          "completed": false
        }
      ]
    }
  ]
}
```

## Deployment

Quarter Clock builds to static files, so you can host it anywhere:

- **GitHub Pages** — Free, works out of the box
- **Netlify / Vercel** — Just connect your repo
- **Any static host** — Upload the `dist/` folder

No server-side logic, no environment variables, no database connections needed.

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/cool-thing`)
3. Commit your changes (`git commit -m 'Add cool thing'`)
4. Push to the branch (`git push origin feature/cool-thing`)
5. Open a Pull Request

## License

[MIT](LICENSE) — do whatever you want with it.

---

Built for people who like to plan in quarters.
