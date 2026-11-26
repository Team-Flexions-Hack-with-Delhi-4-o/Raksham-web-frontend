# COVEXCODE.md

The **Raksham web frontend** — a React 19 + Vite 8 single-page app for a legal-assistance
platform for India: a public marketing site, sign-in/create-account screens, and a signed-in app
(`/app/*`) with Sachi (AI guidance), problem areas, advocate discovery, drafts, checklists and
legal resources. English and Hindi. The backend is a **separate** project; most signed-in features
currently run on local sample data.

## Commands (from `package.json`; run in project root)

| Command | What it does |
| --- | --- |
| `npm install` | Install deps (Node 20.19+ per README) |
| `npm run dev` | Vite dev server on `http://localhost:5173` |
| `npm run lint` | `eslint .` — the only automated check; keep it clean |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` |

There is **no test runner**: no `test` script, no vitest/jest dependency, no `*.test.*` files.
Verify changes with `npm run lint`, `npm run build`, and by loading the page in a browser.
`postbuild` copies `dist/index.html` to `dist/404.html` (SPA fallback for static hosts).

## Environment

Copy `.env.example` to `.env` (git-ignored). `.env.production` **is** committed and sets the
deployed API URL plus the demo login.

- `VITE_API_BASE_URL` — backend base incl. `/api/v1`, no trailing slash. Empty ⇒ every API call
  returns `not-connected` and the UI must say so.
- `VITE_QUICK_EXIT_URL` — destination of the Quick exit button (default Google).
- `VITE_ENABLE_TEST_LOGIN` — demo login (`test@gmail.com` / `test123`). Always on under
  `import.meta.env.DEV`; in a build only when `true`. Not security, values ship in the bundle.

`VITE_*` values are public in the browser bundle — never put a secret there.

## Layout

- `src/main.jsx` → `src/App.jsx` (a re-export shim) → **`src/app/App.jsx`, the single route table**:
  public `/`, `/auth/*`, and `/app/*` wrapped in `RequireSession` + `AppLayout`.
- `src/pages/` route screens — `pages/` public, `pages/auth/`, `pages/app/` signed-in.
  `src/sections/` the home-page sections only (composed by `pages/HomePage.jsx`).
- `src/components/` by area: `app/` (signed-in shell, sidebar, chat, cards, modals), `auth/`,
  `common/` (shared marketing pieces), `layout/` (public navbar/footer), `ui/` (Button),
  `advocates/`.
- `src/data/*.js` static content and English-only sample data; ids/labels here are referenced from
  the locale files (`data/helplines.js`, `data/auth.js`).
- `src/i18n/` i18next init + `locales/`: `en.json`/`hi.json` = public site,
  `app.en.json`/`app.hi.json` = signed-in app. Language persists in `localStorage`
  (`raksham.language`); use `useLanguage()` for the active language.
- `src/services/` all backend access: `apiClient.js` is the only `fetch` wrapper (returns
  `{ ok: true, ...data }` or `{ ok: false, reason }` where reason is `not-connected`, `network`,
  `timeout`, `cancelled` or a backend error code). Mock services (`draftService`, `checklistService`, …) keep
  state in **`sessionStorage`** via `sessionStore.js`; `testLogin.js` + `session.js` hold the demo
  session flag.
- `src/styles/` one hand-written CSS file per area, **all imported by `src/styles/index.css`**;
  design tokens in `tokens.css`. `src/hooks/`, `src/utils/` shared logic.
  `src/assets/images/logo.png`; `public/` favicon + assets.
- `docs/system-design/` the product/design docs — mostly describing things **not built yet**;
  don't treat them as a description of the code.

## Conventions to follow

- **All user-facing copy goes in the locale JSON, never hardcoded in JSX**, and both `en`/`hi`
  versions are added together. Data modules usually hold ids/numbers only, with text under matching
  locale keys.
- **Styling is plain CSS with BEM-ish `block__element` class names.** Tailwind v4 is wired into
  `vite.config.js` but no Tailwind utility classes are used in JSX — don't start mixing them in;
  add rules to the relevant `src/styles/*.css` and import that file from `src/styles/index.css`.
  Use the `tokens.css` custom properties rather than raw colours.
- **Imports use explicit extensions** (`./Foo.jsx`, `../i18n/index.js`) and are relative — there is
  no path alias. Components are `default` exports; helpers, data and services are **named** exports.
- ESLint includes the react-refresh rule, so a `.jsx` file should export **only components**; put
  constants and helpers in separate `.js` modules (as `src/data/` and `src/utils/` do).
- Callers must treat `{ ok: false, … }` from a service as "nothing happened" and render the
  `not-connected` / error state honestly — never fake success. Keep the existing result shape when
  adding services, and route new API calls through `apiRequest`.
- Sample/demo edits belong in `sessionStorage`, not `localStorage` (per-tab, nothing persisted).
- Safety features are load-bearing, not decoration: `QuickExitButton`, the emergency helplines
  (`data/helplines.js`) and the "not legal advice" disclaimers must stay. Confirm helpline numbers
  and official-site links against official sources before changing them.
- Adding a signed-in screen: page in `src/pages/app/`, route in `src/app/App.jsx`, nav entry in
  `appNav` (`src/data/app.js`), CSS in a `src/styles/app-*.css` file.

- **Public site vs app CSS is a hard boundary, and it is already mostly enforced by who reads what.**
  `tokens.css`'s `--fs-*`, `--section-space`, `--wrap-pad`, `--nav-height` and `--helpline-overlap`
  are consumed only by the public stylesheets (`hero`/`why`/`categories`/`how-it-works`/
  `human-help`/`advocate-finder`/`resources`/`privacy`/`navbar`/`footer`), never by `app-*.css` or
  `auth.css` — so they are the safe place to retune the public type scale and vertical rhythm.
  **Not** safe: `--color-yellow` (aliased by `--app-yellow` in `app.css`) and `.btn`/`.btn--md`
  (shared with the auth screens). `.btn--sm`/`--lg`/`--xl` are public-only.
  `components/advocates/*` (RingCarousel, AdvocateBudgetCard, AdvocatePortrait) are public-only;
  the signed-in app has its own `components/app/AdvocateCard.jsx` and the `adv-*`/`adv-btn` classes.

## Editing files (gotcha)

Source files are checked out with **CRLF** line endings, and `read_file` normalises them in its
output. A multi-line `old_string` copied from a read therefore will not match the file on disk:
anchor `edit_file` on a single line, or pass line endings that match the file.
