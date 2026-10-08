# Venkat Portfolio

A responsive, editable React + TypeScript portfolio built with Vite. Personal content is centralized in `src/data/`, while layout and styling live in `src/App.tsx` and `src/styles/global.css`.

## Run it locally

1. Install Node.js (20 or newer).
2. Open this folder in VS Code.
3. Open the integrated terminal and run `npm install` once.
4. Run `npm run dev` and open the local URL Vite prints (usually `http://localhost:5173`).
5. When ready to publish, run `npm run build`. The finished static site is in `dist/`.

## Update your portfolio

- Name, bio, education, email, phone, and social links: `src/data/profile.ts`
- Projects, tools, timeline, community events, creative skills, languages, and interests: `src/data/portfolio.ts`
- Main page sections and interactions: `src/App.tsx`
- Colors, typography, spacing, responsive breakpoints, and motion: `src/styles/global.css`
- SEO title and description, favicon, font loading: `index.html` and `favicon.svg`

To add a project, copy one object in the `projects` array in `src/data/portfolio.ts`, fill in its fields, and add it there. The project selector and details panel update from this data. Empty optional GitHub/demo links are not shown. Keep descriptions factual and replace bracketed prompts before publishing.

## Add photos

Place your own images in the matching folders under `src/assets/`:

- `profile/` — portrait images
- `football/` — match, team, and award photos
- `theatre/` — stage photos, posters, and certificates
- `projects/` — screenshots and demos
- `events/` — community and event photos
- `certificates/` — certificates and recognitions

The current site uses designed CSS artwork and a few optimized personal photos, including football and community moments. To replace a photo, add its optimized file to the matching folder and update the import in `src/App.tsx`. Avoid very large originals; export web images around 1600px wide and use WebP or AVIF where possible.

## Before publishing

- Language entries, awards, workshops, and certificates are in `src/data/portfolio.ts`.
- Add new projects and your exact role in `src/data/portfolio.ts` when you want to feature them.
- Add any exact football awards and photo assets you want to show.
- The provided GitHub link points to the GitHub homepage because that was the supplied URL; change it to your profile URL if desired.
- Use a real hosted domain when you have one; Open Graph metadata can be updated in `index.html`.

No experience percentages or unprovided awards are included. Reduced-motion preferences are respected, and the cursor enhancement is disabled on touch devices.
