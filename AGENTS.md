# AGENTS.md

## Cursor Cloud specific instructions

This is a single-service React 19 + Vite 6 + TypeScript marketing site (Tailwind CSS v4, `motion`, `lucide-react`). There is no backend and no test suite.

- Package manager: **npm** (no lockfile committed). Dependencies are installed by the startup update script.
- Standard commands live in `package.json` scripts:
  - Dev server: `npm run dev` (Vite on port `3000`, host `0.0.0.0`).
  - Lint/typecheck: `npm run lint` (runs `tsc --noEmit`; there is no ESLint).
  - Build: `npm run build`.
- The Vite build prints a harmless CSS `@import must precede all other statements` warning from the Google Fonts import in `src/index.css`; it does not fail the build.
- Despite `@google/genai` being a dependency and `.env.example` listing `GEMINI_API_KEY`/`APP_URL`, `src/App.tsx` does not call the Gemini API — the site renders fully without any env vars or secrets.
- The product/hero images are hardcoded external Unsplash stock URLs and are not guaranteed to depict Dr Pepper cans; this is existing content, not an environment problem.
