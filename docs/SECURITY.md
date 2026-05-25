# Security posture & checklist

This covers the **current** prototype and the **minimum** to get right as it goes online.
The backend/auth design lives in [rfc/0001-backend-and-auth.md](rfc/0001-backend-and-auth.md).

## Today: what the prototype is and isn't

- It is a **public static site**. Anyone can open it and read all of its code — that's
  normal and fine for frontend code.
- There is **no authentication and no server**, so:
  - the dönerci/tedarikçi switch is a convenience toggle, **not** an access control;
  - all "data" is in the visitor's own browser (`localStorage`) and never leaves it;
  - there is nothing private to protect server-side, and no secrets in the repo.
- **Therefore the current security risk is low** — but the app is also not *usable* as a
  real multi-user product, because no data is shared or protected. Security and usability
  both improve at the same step: adding a backend with real auth.

## The golden rules (apply now and forever)

1. **Never put a secret in the frontend or the repo.** Anything shipped to the browser is
   public. Only *publishable* keys (e.g. a Supabase **anon** key, which is safe **only**
   because Row Level Security restricts what it can do) may live in client code. Admin /
   service-role keys, SMTP creds, payment keys, etc. must stay server-side.
2. **The server is the trust boundary, not the UI.** Hiding a button or filtering a list in
   React is presentation, not security. Every access rule must be enforced on the backend
   (database RLS policies and/or server checks).
3. **Validate on the server.** Treat all client input as hostile; validate types, ranges,
   and ownership before writing.
4. **Use HTTPS everywhere.** GitHub Pages already serves the frontend over HTTPS; require it
   for the backend too.

## Minimum checklist to reach a "usable secure prototype"

- [ ] Add authentication so a user is a real account, not a role toggle (see RFC → Supabase
      Auth recommended).
- [ ] Store each user's role (`donerci` / `tedarikci`) server-side and enforce it with
      database Row Level Security — do not trust a role sent from the client.
- [ ] Move all reads/writes behind one data-access module so access goes through audited
      paths (and to make the localStorage→backend swap localized).
- [ ] Keep only the publishable anon key in the frontend; put it in a single config spot,
      not scattered. Service keys live only in the backend / Supabase dashboard.
- [ ] Add a `.env.example` (no real values) documenting required config; ensure real `.env`
      files are git-ignored (already covered by `.gitignore`).
- [ ] Add basic input validation and sensible row limits on every write.
- [ ] Add a Content-Security-Policy and standard headers where the host allows it (GitHub
      Pages can't set arbitrary headers; a `<meta>` CSP is a partial option — see notes).
- [ ] Rate-limit auth and write endpoints (Supabase provides some; review settings).
- [ ] Decide data retention / deletion (the "Hesabı Sil" button must actually delete).

## Notes & caveats specific to this app

- **In-browser Babel + React dev build**: not a security hole by itself, but it means the
  app is slow and unminified. A real build (Vite) is recommended before a wide launch — see
  the RFC's "Production readiness" follow-up.
- **CSP on GitHub Pages**: you cannot set HTTP response headers on Pages. You can add a
  `<meta http-equiv="Content-Security-Policy">`, but note the app currently loads React /
  Babel from a CDN and uses inline styles, so a CSP must allow those sources (or, better,
  self-host the libraries after adopting a build step). Document the chosen CSP when added.
- **Images as data-URLs**: supplier photo uploads are stored inline. With a backend, move
  these to object storage (e.g. Supabase Storage) and store URLs instead.
- **No PII today**; once real accounts and customer phone numbers/addresses are stored,
  treat them as personal data (relevant for EU/Italy users → GDPR): collect the minimum,
  secure it with RLS, and support deletion.

## Reporting

This is a prototype with no formal security contact yet. If you find an issue, open a
private note to the repository owner rather than a public issue.
