# Dr Pepper: The 23 Flavor Experience

Immersive marketing website for Dr Pepper — brand storytelling, product discovery, limited drops, and store locator UX.

> Fan / portfolio project. Not affiliated with Keurig Dr Pepper or the Dr Pepper brand.

## Features

- **Hero** — Full-viewport brand intro with motion (“The One You Crave”)
- **Product lineup** — Interactive showcase for Original, Cherry, Cream Soda, and Zero Sugar
- **Insights** — Simple demo dashboard: highlight metrics, CSS bar chart for flavor share, regional favorites table
- **Flavor quiz** — 3-question scorer that recommends a product (easy-to-explain point totals)
- **The 23 Story** — Brand narrative around the 23-flavor blend
- **Limited drops** — Seasonal / scarcity-style promo section
- **Store locator** — Free OpenStreetMap map with zip/city search, geolocation, and nearby grocery/convenience markers
- **Responsive nav** — Desktop links + mobile menu and sticky mobile CTA
- **Motion** — Scroll/entrance animations via Motion (`motion/react`)

## Tech stack

| Layer | Tools |
| --- | --- |
| UI | React 19, TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Icons | Lucide React |
| Animation | Motion |
| AI (optional) | Google Gemini (`@google/genai`) via `GEMINI_API_KEY` |

## Project structure

```
Dr.-Pepper-/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── metadata.json          # App name / description / permissions
├── .env.example           # GEMINI_API_KEY, APP_URL
└── src/
    ├── main.tsx           # React entry
    ├── index.css          # Global styles / Tailwind
    ├── data.ts            # Sample survey + quiz scoring data
    ├── Insights.tsx       # By-the-numbers dashboard
    ├── FlavorQuiz.tsx     # Flavor match quiz
    └── App.tsx            # Page shell + marketing sections
```

## Getting started

### Prerequisites

- Node.js 18+ (recommended: current LTS)
- npm

### Install

```bash
git clone https://github.com/rohans16-cmyk/Dr.-Pepper-.git
cd Dr.-Pepper-
npm install
```

### Environment (optional)

Copy the example env file if you plan to use Gemini later:

```bash
cp .env.example .env
```

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Gemini API key (injected into the client via Vite `define`) |
| `APP_URL` | Public app URL (hosting / callbacks) |

The store locator uses **OpenStreetMap** (Leaflet + Nominatim + Overpass) and needs **no API key or billing**.

### Run locally

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000) (`vite --port=3000 --host=0.0.0.0`).

### Other scripts

```bash
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run lint     # Typecheck (`tsc --noEmit`)
npm run clean    # Remove dist/
```

## Brand notes

Primary palette used in the UI:

- Maroon: `#711F25`
- Cream: `#F5F2ED`
- Cherry accent: `#9E1B32`

Product imagery currently uses Unsplash placeholders — swap for licensed brand assets before any public marketing use.

## Roadmap ideas

Possible next steps:

- Swap demo survey numbers for a real Google Form export
- Add a simple ZIP → nearest store list (static GeoJSON)
- Host on Vercel / Netlify with a custom domain

## License

Source is Apache-2.0 licensed in file headers. Brand names and trademarks belong to their respective owners.
