# RFC 0001 — Backend & Authentication for Order Flow

- **Status:** Draft (awaiting decision)
- **Author:** Order Flow maintainers
- **Created:** 2026-05-25
- **Supersedes:** —

## 1. Summary

Order Flow is currently a frontend-only prototype: all data lives in each visitor's
browser `localStorage`, so nothing is shared between users or devices and nothing is
protected. This RFC proposes how to add a **backend with authentication** so the app
becomes a genuinely usable, multi-user product with **acceptable security** and **minimum
effort** for a small, non-specialist team.

**Recommendation: adopt [Supabase](https://supabase.com).** It gives us a Postgres
database, hosted authentication, file storage, and automatically generated, secured APIs
behind a single client library — with security enforced in the database via Row Level
Security (RLS). It is the lowest-effort path that still meets a reasonable security bar, has
a free tier suitable for a prototype, and lets us keep the existing static frontend.

## 2. Background & problem

See [../ARCHITECTURE.md](../ARCHITECTURE.md) for the current design. Key facts:

- Two roles: **dönerci** (restaurant/buyer) and **tedarikçi** (supplier/seller).
- The buyer places orders; the supplier sees incoming orders, manages a catalog and
  customers, and tracks payments.
- "Communication" between roles today is faked by reading/writing the **same**
  `localStorage` key in **one** browser. There is no cross-user, cross-device sharing.
- There is no login; the role switch is a UI toggle, not a security boundary.

**What we actually need to ship a usable prototype:**

1. Real user accounts and login.
2. Each user has a role; a supplier sees only their own orders/customers/catalog, a buyer
   sees only their own orders — enforced on the server, not the client.
3. Orders placed by a buyer reliably reach the correct supplier, on any device.
4. Persistent, shared data (catalog, orders, payments) with acceptable security.
5. Keep cost and operational burden low; keep the option to keep the static frontend.

## 3. Goals / Non-goals

**Goals**
- Multi-user, multi-device, shared and persistent data.
- Authentication + role-based authorization enforced server-side.
- Minimum effort and cost; minimal ops for a non-specialist maintainer.
- A migration path that does not require a big-bang rewrite of the frontend.

**Non-goals (for this RFC / first iteration)**
- Payment processing / invoicing integrations.
- A full production build pipeline (tracked as a follow-up in §10).
- Native mobile apps, offline-first sync, advanced analytics.
- Onboarding flows for arbitrary new suppliers/buyers (start with a known, small set).

## 4. Requirements & constraints

- **R1** Auth with email/password and/or magic link; password reset.
- **R2** Server-enforced authorization by role and ownership (RLS or equivalent).
- **R3** Buyer→supplier order delivery across devices, near-real-time if cheap.
- **R4** Image storage for product/logo uploads (replace data-URLs).
- **R5** Free or very cheap at prototype scale; predictable pricing.
- **R6** Low ops: ideally managed/hosted, no servers to patch.
- **C1** Frontend has **no build step** today; a solution that works with a CDN-loaded
  client library lets us migrate incrementally. (A build step is desirable later — §10.)
- **C2** Maintained primarily by a non-software-engineer working with Claude Code, so
  fewer moving parts is strongly preferred.
- **C3** Users likely in the EU/Italy → be mindful of personal data (GDPR): minimize and
  allow deletion.

## 5. Options considered

### Option A — Supabase (RECOMMENDED)

Managed Postgres + Auth + Storage + auto-generated REST/realtime APIs, accessed via
`@supabase/supabase-js`. Authorization is enforced in the database with **Row Level
Security** policies. The browser uses a **publishable anon key**; it is safe to ship
because RLS decides what that key can actually read/write.

- **Effort:** Low. Define tables + RLS in the dashboard; call `supabase-js` from the
  frontend. `supabase-js` is available from a CDN, so it works with our **no-build** setup.
- **Security:** Good for a prototype. RLS gives row-level, role-aware rules in one place;
  Auth handles sessions, password hashing, reset, rate limits.
- **Cost:** Free tier (one project, generous limits) is plenty for a prototype; paid tier
  ~US$25/mo when we outgrow it.
- **Realtime (R3):** Built-in Postgres change subscriptions — orders can appear on the
  supplier screen live.
- **Storage (R4):** Supabase Storage with its own RLS-style policies.
- **Risks:** Vendor lock-in (mitigated: it's plain Postgres, exportable); RLS has a
  learning curve (mitigated: policies are small and we document them here).

### Option B — Firebase (Firestore + Auth)

Google's managed NoSQL (Firestore) + Auth + Storage, secured by "Security Rules".

- **Effort:** Low, comparable to Supabase; also CDN-friendly (no build needed).
- **Security:** Good; rules language is capable but its own DSL.
- **Trade-offs vs. Supabase:** NoSQL data modeling is a worse fit for our relational data
  (orders ↔ items ↔ customers ↔ payments). Query/aggregation ergonomics are weaker, and
  costs can be harder to predict under read-heavy patterns. No SQL export.

### Option C — PocketBase (self-hosted single binary)

Open-source Go binary bundling SQLite + Auth + admin UI + REST/realtime.

- **Effort:** Low to set up locally; **but** requires hosting a server (a small VPS),
  TLS, backups, and updates — ongoing ops that conflict with **C2**.
- **Security:** Reasonable, but more of the burden (patching, backups, network) is on us.
- **Cost:** A few US$/mo for a VPS. Cheapest at scale, most hands-on.

### Option D — Custom backend (Node/Express or similar + Postgres)

Write our own API.

- **Effort:** High. We'd build auth, sessions, authorization, validation, deployment,
  CORS, and a hosting story ourselves — the most code and the most to get wrong.
- **Security:** Fully in our hands (good and bad). Easy to introduce mistakes without
  specialist review.
- **When it makes sense:** later, if requirements outgrow a BaaS. Not now.

### Option E — Stay client-only (+ optional cloud sync)

Keep `localStorage`, maybe add export/import or a thin sync service.

- **Effort:** Lowest. **But** it does not deliver real multi-user sharing or any access
  control, i.e. it fails R1–R3. Rejected as a destination (fine only as today's status).

## 6. Comparison

| Criterion | A: Supabase | B: Firebase | C: PocketBase | D: Custom | E: Client-only |
| --- | --- | --- | --- | --- | --- |
| Effort to first usable build | Low | Low | Low-med | High | Lowest |
| Ongoing ops | None (managed) | None (managed) | We host/patch | We host/patch | None |
| Fits relational data | ✅ (Postgres) | ⚠️ (NoSQL) | ✅ (SQLite) | ✅ | n/a |
| Auth included | ✅ | ✅ | ✅ | ❌ build it | ❌ |
| Server-enforced authz | ✅ RLS | ✅ Rules | ✅ | ✅ DIY | ❌ |
| Works with no-build frontend | ✅ CDN | ✅ CDN | ✅ | ✅ | ✅ |
| Realtime | ✅ | ✅ | ✅ | DIY | ❌ |
| File storage | ✅ | ✅ | ✅ | DIY | ⚠️ data-URLs |
| Cost at prototype scale | Free | Free | ~VPS | ~VPS+ | Free |
| Lock-in / portability | Low (SQL export) | High | Low | Low | n/a |

## 7. Recommendation

Adopt **Supabase**. It meets R1–R6, fits our relational data, keeps the static frontend
viable, centralizes security in RLS, and is the least to build and operate. Firebase is the
runner-up but a worse data-model fit; PocketBase/custom add ops/code we don't want yet.

## 8. Proposed design with Supabase

### 8.1 Auth & roles

- Use **Supabase Auth** (email + password, optionally magic links). Sessions and password
  hashing are handled for us.
- Create a `profiles` table keyed by the auth user id, holding `role`
  (`donerci` | `tedarikci`), display name, company, contact info, and (for suppliers) a
  link to their supplier record. A trigger creates the profile row on sign-up.
- **Roles are read from the database, never trusted from the client.** RLS policies
  reference `profiles.role` and ownership columns.

### 8.2 Data model (first cut)

```
profiles        (id = auth.users.id, role, full_name, company, phone, address, vat, logo_url)
suppliers       (id, owner_profile_id, name, description)
products        (id, supplier_id, name, price, unit, category, image_url, archived)
customers       (id, supplier_id, name, contact, address, first_order_at)   -- supplier's CRM
orders          (id, buyer_profile_id, supplier_id, status, note, created_at, total)
order_items     (id, order_id, product_id, name, qty, unit, unit_price)
order_status_log(id, order_id, status, changed_by, changed_at)
payments        (id, supplier_id, customer_id, amount, method, note, paid_at)
secretary_replies(id, order_id, supplier_id, text, created_at)
```

This mirrors today's `localStorage` shapes (see ARCHITECTURE.md) so the frontend changes
are mostly "call the API instead of reading a key".

### 8.3 Authorization (RLS) — policy sketch

Enable RLS on every table; default-deny, then add policies. Illustrative (pseudo-SQL):

```sql
-- A user can read/update only their own profile.
create policy "own profile"
  on profiles for all
  using ( id = auth.uid() );

-- A supplier owns their supplier row, products, customers, payments.
create policy "supplier manages own products"
  on products for all
  using ( supplier_id in (select id from suppliers where owner_profile_id = auth.uid()) );

-- Buyers can read products of any supplier they're allowed to order from
-- (start simple: all active products are readable to authenticated buyers).
create policy "buyers read catalog"
  on products for select
  using ( auth.role() = 'authenticated' and not archived );

-- An order is visible to its buyer and to the supplier it was sent to.
create policy "order visible to its parties"
  on orders for select
  using (
    buyer_profile_id = auth.uid()
    or supplier_id in (select id from suppliers where owner_profile_id = auth.uid())
  );

-- A buyer can create an order only as themselves.
create policy "buyer creates own order"
  on orders for insert
  with check ( buyer_profile_id = auth.uid() );

-- Only the receiving supplier can change order status.
create policy "supplier updates order status"
  on orders for update
  using ( supplier_id in (select id from suppliers where owner_profile_id = auth.uid()) );
```

These are sketches to be reviewed and tested, not final. The point: **all access rules
live in the database**, so the publishable anon key in the browser cannot bypass them.

### 8.4 Frontend integration (incremental, no-build-friendly)

1. Add `@supabase/supabase-js` from a CDN in `index.html` and initialize a single client
   with the project URL + **anon** key (publishable; safe under RLS). Keep these in one
   small config object/file, not scattered.
2. **Introduce a data-access module** (e.g. `zincir/data.js`) that exposes functions like
   `listProducts(firmId)`, `placeOrder(order)`, `listIncomingOrders()`,
   `setOrderStatus(id, status)`, `addPayment(p)`, etc. Initially it can still wrap
   `localStorage`; then swap the internals to Supabase. The screens call the module, so the
   swap is localized (this is the single most useful refactor and should happen first).
3. Replace direct `localStorage.getItem/setItem('zincir-*')` calls with the module.
4. Use Supabase realtime subscriptions for incoming orders to replace the current
   `storage`/custom-event hack.
5. Move image uploads to Supabase Storage; store URLs instead of data-URLs.

### 8.5 Security specifics (see also ../SECURITY.md)

- Only the **anon** key ships to the browser; **service-role** key stays in the Supabase
  dashboard / any server-side function and is never committed.
- Default-deny RLS on all tables; add the minimum policies; **test** them with two accounts.
- Validate inputs in the client for UX **and** rely on DB constraints/policies for safety.
- Enforce HTTPS (frontend already on HTTPS via Pages; Supabase is HTTPS).
- Configure allowed redirect URLs / CORS to our Pages origin.
- Keep personal data minimal; implement real account deletion for the "Hesabı Sil" button.

## 9. Migration plan (phased, low-risk)

1. **Refactor to a data-access module** while still on `localStorage`. Ship; no behavior
   change. (De-risks everything that follows.)
2. **Stand up Supabase**: create project, tables, RLS; seed the demo firms/catalog.
3. **Add Auth**: login/sign-up UI; replace the role *toggle* with the logged-in user's
   role from `profiles`. Keep the toggle behind a dev flag for demos if useful.
4. **Point the data module at Supabase** table by table (catalog → orders → statuses →
   customers → payments), verifying each against the two-account RLS test.
5. **Realtime + Storage**: live incoming orders; move images to Storage.
6. **Cutover & cleanup**: remove `localStorage` fallbacks; document the anon key location;
   write the deletion/retention behavior.

A reversible escape hatch exists at every step: the data module can keep a `localStorage`
implementation behind a flag until the Supabase path is proven.

## 10. Follow-ups (out of scope here, but on the radar)

- **Production build (Vite)**: stop shipping React's dev build and in-browser Babel;
  bundle/minify; lets us self-host libraries and tighten CSP. Recommended before a wide
  public launch. Worth its own short RFC.
- **CSP & headers**: GitHub Pages can't set headers; consider a host that can (e.g. Cloudflare
  Pages / Netlify) once a build exists, or a `<meta>` CSP as an interim.
- **Onboarding** real suppliers/buyers (invites, supplier approval).
- **Observability**: basic error logging.

## 11. Open questions

- Email/password only, or also magic-link / social login?
- Can any authenticated buyer see every supplier's catalog, or only suppliers they're
  linked to? (Affects the `products` read policy.)
- Do we need multi-user *within* a supplier (e.g. a "secretary" sub-account), or is one
  account per supplier enough for v1?
- Hosting: stay on GitHub Pages, or move to a host that supports headers/build once we add
  a build step?

## 12. Decision

> _To be filled in when accepted: chosen option, who decided, date, and any amendments._
