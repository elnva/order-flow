# Order Flow — Documentation

| Document | What it covers |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the current (frontend-only) app is wired: script loading, components, the `localStorage` "data model", and screen map. |
| [SECURITY.md](SECURITY.md) | Current security posture of the static prototype and the minimum things to get right before/while putting it online. |
| [rfc/0001-backend-and-auth.md](rfc/0001-backend-and-auth.md) | **Decision record:** options for adding a backend + authentication with minimum effort and acceptable security. Compares Supabase, Firebase, PocketBase and a custom backend; recommends Supabase; includes a proposed data model, RLS policy sketches, and a phased migration plan from `localStorage`. |

## RFC process (lightweight)

RFCs (Request For Comments) are short design proposals. Each lives in `docs/rfc/` as
`NNNN-short-title.md`, carries a **Status** (`Draft` → `Accepted` / `Rejected` →
`Implemented`), and records the decision and its rationale so future contributors
understand *why* things are the way they are. Open a new one when a change is large enough
that the approach should be agreed before code is written.
