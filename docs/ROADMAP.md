# Roadmap — from prototype to production

A pragmatic, **no-overengineering** path to take Order Flow from today's frontend-only
prototype to a small but real, secure product. Each phase ends in something shippable; do
them in order and stop whenever "good enough" is genuinely good enough.

Related docs: [ARCHITECTURE.md](ARCHITECTURE.md) · [SECURITY.md](SECURITY.md) ·
[rfc/0001-backend-and-auth.md](rfc/0001-backend-and-auth.md).

**Principles**
- Ship the smallest thing that works; add complexity only when a real need appears.
- The database/server is the security boundary — never the UI.
- Don't build infra we don't yet need (no microservices, queues, k8s, etc.).

---

## Phase 0 — Tidy what exists (½–1 day)

Quick hygiene; no architecture change.

- [ ] `git rm --cached .DS_Store` so the now-ignored file stops being tracked.
- [ ] Confirm all product images are committed (they must be, or they 404 on Pages).
- [ ] Skim the README/CLAUDE/docs for anything already out of date.

## Phase 1 — Make the code backend-ready (1–2 days)

The single most valuable refactor; unlocks everything later with low risk.

- [ ] Introduce one **data-access module** (`zincir/data.js`) exposing functions like
      `listProducts`, `placeOrder`, `listIncomingOrders`, `setOrderStatus`, `addPayment`.
      Implementation still wraps `localStorage` for now.
- [ ] Route every screen's reads/writes through it (remove scattered
      `localStorage.getItem/setItem('zincir-*')`).
- [ ] Ship — behavior is identical, but the swap point is now in one file.

## Phase 2 — Backend + auth (Supabase) (2–4 days)

Implements [RFC 0001](rfc/0001-backend-and-auth.md). This is the step that makes the app
actually usable (shared, multi-user, persistent) **and** secure at the same time.

- [ ] Create the Supabase project; define tables per the RFC data model.
- [ ] Turn on **default-deny RLS**; add the minimum policies; **test with two accounts**
      (one buyer, one supplier) to confirm each can only see/do what they should.
- [ ] Add login / sign-up; derive the role from `profiles`, not a UI toggle.
- [ ] Point `data.js` at Supabase table by table (catalog → orders → statuses → customers
      → payments); keep a `localStorage` fallback behind a flag until proven.
- [ ] Put **only** the anon (publishable) key in the frontend, in one config spot. Keep the
      service-role key server-side only.
- [ ] Implement real account deletion (the "Hesabı Sil" button must actually delete).

## Phase 3 — Real-time, storage & polish (1–2 days)

- [ ] Replace the `storage`/custom-event order hack with Supabase realtime subscriptions so
      incoming orders appear live.
- [ ] Move product/logo uploads to Supabase Storage; store URLs instead of data-URLs.
- [ ] Basic input validation + sensible DB constraints on writes.
- [ ] Friendly empty/error/loading states for network calls.

## Phase 4 — Production build (2–3 days)

Do this before a wide public launch, not before. (Worth its own short RFC.)

- [ ] Adopt **Vite**: bundle/minify, ship React's production build, stop transforming JSX in
      the browser. Faster, smaller, self-hostable libraries.
- [ ] Keep deploying the built output (GitHub Pages still works; or move to a host that can
      set headers — see below).
- [ ] Add a **Content-Security-Policy** and standard security headers (easier once the build
      lets us self-host React/Babel). On GitHub Pages, an interim `<meta>` CSP only.

## Phase 5 — Launch readiness (1–2 days)

- [ ] A tiny smoke test (or written click-through checklist) for the core flows: place an
      order, supplier receives it, status change, add a payment.
- [ ] Confirm HTTPS and correct allowed redirect URLs / CORS for the deployed origin.
- [ ] Privacy: collect minimum personal data; note retention/deletion (GDPR for EU/Italy).
- [ ] A way to back up / export data (Supabase provides SQL export — document it).
- [ ] Basic error logging so failures are visible.

---

## Explicitly out of scope (until a real need shows up)

Avoid these unless a concrete requirement forces them — they are classic overengineering
for an app at this stage:

- Microservices, message queues, Kubernetes, or any custom server before a BaaS proves
  insufficient.
- Multi-region, horizontal scaling, caching layers.
- A design system / component library rewrite.
- Heavy test pyramids — a short smoke checklist is enough for a prototype.
- Premature payment/ERP integrations.

## Rough sequencing

```
Phase 0 ─ tidy
Phase 1 ─ data module            ← do first; de-risks the rest
Phase 2 ─ Supabase + auth        ← makes it usable AND secure (RFC 0001)
Phase 3 ─ realtime/storage/polish
Phase 4 ─ Vite build             ← before wide launch
Phase 5 ─ launch checklist
```

"Production-ready for a small real user base" is reached at the **end of Phase 3** for a
closed/invited group, or **end of Phase 5** for a wider public launch.
