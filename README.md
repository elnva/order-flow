# Order Flow — Tedarik Zinciri Yönetim Sistemi

A B2B supply-chain ordering prototype for the döner / food-wholesale trade. Restaurants
("dönerci") browse supplier catalogs, place orders, and track invoices & debt; suppliers
("tedarikçi") receive orders, manage their product catalog and customers, and track
payments. The UI is in Turkish.

> **Status: prototype.** There is no backend yet. All data lives in the browser's
> `localStorage`, so it is per-device, not shared between users, and can be lost.
> See [docs/rfc/0001-backend-and-auth.md](docs/rfc/0001-backend-and-auth.md) for the plan
> to turn this into a real multi-user app.

## Live demo

Deployed via GitHub Pages: **https://elnva.github.io/order-flow/zincir/**

GitHub Pages serves the repository root, and the app lives in `zincir/`, so the app URL
includes the `/zincir/` path.

## Tech stack

- **No build step.** Plain HTML + React 18 + Babel are loaded from a CDN, and the `.jsx`
  files are transformed in the browser at runtime (`<script type="text/babel">`).
- **Styling:** inline styles + a small amount of CSS in `zincir/index.html` (CSS custom
  properties for theming, dark/light mode).
- **State & persistence:** React state + `localStorage`. No server, no database.

This zero-build setup is great for quick iteration but is **not** suitable for production
as-is (the in-browser Babel transform is slow and ships a development build of React). A
move to a real build (e.g. Vite) is tracked as a follow-up in the RFC.

## Run it locally

Any static file server works. From the repo root:

```bash
# Python (built in on macOS)
python3 -m http.server 4599 --directory zincir
# then open http://localhost:4599
```

If you use Claude Code, `.claude/launch.json` already defines a `zincir` server you can
start from the preview tools.

## Project structure

```
order-flow/
├── zincir/                  # the app (this is what GitHub Pages serves)
│   ├── index.html           # entry point, theme CSS, script loading order
│   ├── components.jsx       # shared UI: Icon, Avatar, Btn, Sidebar, Topbar, hooks…
│   ├── app.jsx              # root App component, routing/role switching
│   ├── screens-donerci.jsx  # restaurant screens (catalog, new order, orders, debt)
│   ├── screens-tedarikci.jsx# supplier: printable order, product catalog screen
│   ├── supplier-orders.jsx  # supplier: incoming orders + customer detail
│   ├── supplier-status.jsx  # order status model (bekliyor/onaylandı/iptal)
│   ├── supplier-extras.jsx  # supplier: customers + debt/payment ledger
│   └── img/                 # product images (must be committed to show on Pages)
├── docs/                    # documentation (see docs/README.md)
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   └── rfc/                 # design proposals
├── uploads/                 # scratch image uploads (not used by the app)
├── CLAUDE.md                # guide for working in this repo with Claude Code
└── .claude/                 # Claude Code config (launch server, permissions)
```

## Documentation

- [docs/README.md](docs/README.md) — documentation index
- [docs/ROADMAP.md](docs/ROADMAP.md) — **phased plan to reach production without overengineering**
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the frontend is wired together
- [docs/SECURITY.md](docs/SECURITY.md) — current security posture & must-dos before launch
- [docs/rfc/0001-backend-and-auth.md](docs/rfc/0001-backend-and-auth.md) — **backend
  options (incl. Supabase), recommendation, data model & migration plan**

## Contributing notes

- The two roles are `donerci` and `tedarikci`; the four demo firms are `devran`, `mirva`,
  `baklavaci`, `kervan`.
- New product images **must be committed to git** or they will 404 on GitHub Pages.
- Keep secrets out of the repo. There are none today; when a backend is added, only
  *publishable* keys may live in the frontend (see the RFC and SECURITY.md).
