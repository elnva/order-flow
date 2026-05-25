# CLAUDE.md

Guidance for working in this repository with Claude Code.

## What this is

`order-flow` is a **prototype** B2B supply-chain ordering app (Turkish UI) for the döner /
food-wholesale trade. It is a static, no-build React app. There is **no backend**; all
state is in `localStorage`. See `README.md` for the overview and
`docs/rfc/0001-backend-and-auth.md` for the backend plan.

## The unusual setup — read this first

- **No build step, no bundler, no `package.json`.** `zincir/index.html` loads React,
  ReactDOM and Babel from a CDN, then loads each `.jsx` file as
  `<script type="text/babel">`. Babel transforms JSX **in the browser at runtime**.
- **Script load order matters.** Scripts execute top-to-bottom as listed in
  `index.html`. A symbol must be defined in an earlier script before a later one uses it.
  Current order: `components.jsx` → `screens-donerci.jsx` → `screens-tedarikci.jsx` →
  `supplier-orders.jsx` → `supplier-status.jsx` → `supplier-extras.jsx` → `app.jsx`.
- **Cross-file sharing happens via the shared global scope.** Top-level `const`/`let` in a
  classic script live in the shared global lexical environment, so `const Avatar = …` in
  `components.jsx` is referenceable as a bare `Avatar` in later files. Many files **also**
  do `Object.assign(window, { … })` at the end — this is used both for clarity and for
  `typeof X !== 'undefined'` guards. When you add a shared component or hook, follow the
  same pattern: define it at top level in the earliest file that needs it and add it to
  the `Object.assign(window, …)` export list.
- **Editing rule:** there is no type checker or test suite. Verify changes by running the
  app and clicking through it (see "Running & verifying").

## Conventions

- **Styling is inline** (`style={{…}}`), themed through CSS custom properties defined in
  `index.html` (`var(--blue)`, `var(--surface)`, `var(--text)`, …). Use those tokens, not
  hard-coded colors, so dark/light themes keep working.
- **Responsive:** use the `useIsMobile()` hook (in `components.jsx`, breakpoint 768px) to
  switch layouts. Tables render as stacked cards on mobile; keep that pattern.
- **Language:** UI strings and most comments are Turkish. Match the surrounding language.
- **Roles:** `donerci` (restaurant/buyer) and `tedarikci` (supplier/seller).
- **Demo firms:** `devran`, `mirva`, `baklavaci`, `kervan` (see `FIRM_NAMES`).

## localStorage keys (the current "database")

| Key | Contents |
| --- | --- |
| `zincir-orders` | orders placed by the dönerci |
| `zincir-order-statuses` | per-order status overrides (bekliyor/onaylandı/iptal) |
| `zincir-profile-donerci`, `zincir-profile-tedarikci` | per-role profile |
| `zincir-supplier-products-<firmId>` | supplier-edited catalog per firm |
| `zincir-catalog-version` | cache-busting marker for the seed catalog |
| `zincir-customers` | supplier's customer list |
| `zincir-payments` | supplier's payment ledger |
| `zincir-secretary-replies` | supplier replies to order notes |
| `zincir-viewed-customers-<date>` | "new"-badge bookkeeping |
| `zincir-theme` | `dark` \| `light` |

When the backend lands, these reads/writes should move behind a single data-access module
(see the RFC) so the swap is localized.

## Running & verifying

```bash
python3 -m http.server 4599 --directory zincir   # http://localhost:4599
```

With Claude Code, `.claude/launch.json` defines a `zincir` server; use the preview tools to
start it, resize to mobile (375px) and desktop, and screenshot. There are no automated
tests — manual click-through is the verification.

## Things to be careful about

- **Product images must be committed to git** or they 404 on GitHub Pages.
- **Never commit secrets.** Today there are none. When the backend is added, only a
  *publishable* key (e.g. Supabase anon key, protected by Row Level Security) may appear in
  the frontend. Service-role/admin keys must never reach the client or the repo.
- The `uploads/` folder is scratch space and is not referenced by the app.
