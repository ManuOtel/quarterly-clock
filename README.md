# Quarter Clock

A privacy-first web app for tracking projects across quarters and the year. No accounts, no servers, no tracking—your data stays in your browser.

## Features

- **Year + Quarter Progress** — Track current year progress alongside Q1–Q4
- **Quarter Clock UI** — Analog clock view with month markers and quarter arcs
- **Project Management** — Create projects with start/end dates and subtasks
- **Status Indicators** — See if projects are ahead, on track, or behind
- **Quarter Filters** — Filter subtasks by quarter for multi-quarter projects
- **100% Local Storage** — All data stored in your browser's localStorage
- **Export/Import** — Back up your data as JSON anytime

## Tech Stack

- [Svelte 5](https://svelte.dev/) — Reactive UI framework
- [Vite](https://vite.dev/) — Build tool and dev server
- Browser-only localStorage persistence (no backend)

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/ManuOtel/quarter-clock
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

Projects can span multiple quarters using the start and end dates.

The app calculates progress as: `(days elapsed / total days in quarter) × 100`

Year progress follows the same formula across the full year.

### Project Completion

Completion percentage is calculated from subtasks: `(completed subtasks / total subtasks) × 100`.

### Project Status

Projects are marked as:

- **Ahead** — Completion % is 10%+ higher than expected
- **On Track** — Completion % is within 10% of expected progress
- **Behind** — Completion % is 10%+ lower than expected

### Data Storage

All data lives in `localStorage` as JSON:

```json
{
  "projects": [
    {
      "id": "unique-id",
      "name": "Project Name",
      "startDate": "2026-01-01",
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
- **Docker** — Build and run a containerized static server

No server-side logic, no environment variables, no database connections needed.

### Docker

```bash
# Build the image
docker build -t quarter-clock .

# Run the container
docker run --rm -p 3069:3069 quarter-clock
```

Open [http://localhost:3069](http://localhost:3069) in your browser.

For **Coolify** deployment, set the exposed port to `3069`.

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
