# Architecture (current state)

This describes the app **as it is today**: a static, frontend-only prototype. For where it
is going, see [rfc/0001-backend-and-auth.md](rfc/0001-backend-and-auth.md).

## Big picture

```
Browser
 └─ zincir/index.html
      ├─ loads React + ReactDOM + Babel from a CDN
      ├─ loads each .jsx as <script type="text/babel"> (transformed at runtime)
      └─ renders <App/> into #root
            ├─ role switch: donerci ⇄ tedarikci
            ├─ Sidebar + Topbar + screen area
            └─ screens read/write localStorage (no server)
```

There is no bundler, no `package.json`, no server. The frontend is deployed to GitHub
Pages and served from `https://elnva.github.io/order-flow/zincir/`.

## Script loading & cross-file references

`index.html` loads scripts in this exact order:

1. `components.jsx` — shared primitives (`Icon`, `Badge`, `Avatar`, `Btn`, `SectionLabel`,
   `Logo`, `Sidebar`, `Topbar`, `Footer`, `Toast`, `Drawer`, `EmptyState`) and the
   `useIsMobile()` responsive hook.
2. `screens-donerci.jsx` — buyer screens and seed data (`ProfileScreen`, `HomeScreen`,
   `SupplierScreen`, `NewOrderScreen`, `OrdersScreen`, `DebtScreen`, `STATIC_PRODUCTS`,
   `FIRM_NAMES`, `ORDERS_DATA`).
3. `screens-tedarikci.jsx` — `PrintableOrder` (A4 print/PDF sheet), the supplier
   `SupplierProductsScreen`, and the catalog seed (`DEFAULT_FIRM_PRODUCTS`).
4. `supplier-orders.jsx` — supplier incoming-orders list + `CustomerDetailView`, CSV/PDF
   export, live-order reading from `localStorage`.
5. `supplier-status.jsx` — the order status model (`bekliyor` / `onaylandi` / `iptal`),
   `useOrderStatuses`, the 2-hour edit window, `StatusBadge`.
6. `supplier-extras.jsx` — `SupplierCustomersScreen`, `SupplierDebtScreen` (ledger).
7. `app.jsx` — the root `App`, role/screen routing, profile and theme state.

Because these are classic scripts, **top-level `const`/`let` are shared across files via
the global lexical environment** — that's how `app.jsx` can reference `HomeScreen` defined
in `screens-donerci.jsx`. Most files also `Object.assign(window, {...})` their exports.
**Consequence:** order matters, and name collisions are global. Define shared things once,
in the earliest file that needs them.

## Roles & navigation

- Two roles: `donerci` (buyer) and `tedarikci` (supplier), toggled in the top bar.
- `App.renderScreen()` is a `switch` on `currentScreen`; the `Sidebar` and breadcrumb drive
  navigation. There is **no router and no URL state** — refreshing returns to the default
  screen for the active role.

## Data model (localStorage)

All persistence is `localStorage` JSON under `zincir-*` keys. The important entities:

- **Orders** (`zincir-orders`): `{ id, firm, firmId, customer, date, amount, status,
  items: [{name, qty, unit, price}], note }`. Created by the buyer in `NewOrderScreen`.
- **Order statuses** (`zincir-order-statuses`): `{ [orderId]: { status, by, at } }`.
- **Profiles** (`zincir-profile-donerci`, `zincir-profile-tedarikci`): name, company,
  email, phone, address, vat, logo (data-URL).
- **Supplier catalog** (`zincir-supplier-products-<firmId>`): per-firm products
  `{ id, name, price, unit, img }`. Seeded from `DEFAULT_FIRM_PRODUCTS`; `img` may be a
  resized data-URL when the supplier uploads a photo.
- **Customers** (`zincir-customers`), **Payments** (`zincir-payments`),
  **Secretary replies** (`zincir-secretary-replies`), **theme** (`zincir-theme`).

### How buyer and supplier "communicate" today

The supplier's incoming-orders view (`readLiveOrders()` in `supplier-orders.jsx`) reads the
same `zincir-orders` key the buyer writes, filtered to `firmId === 'devran'`, and listens
for a `zincir-orders-changed` event plus the `storage` event. **This only works within one
browser** — there is no real cross-user channel. Cross-device, multi-user behavior is the
core thing the backend RFC addresses.

## Known limitations (prototype)

- No authentication; the role switch is a UI toggle, not a security boundary.
- Data is per-browser, can be cleared, and is not shared between real users/devices.
- `localStorage` is ~5 MB; supplier-uploaded images are resized to fit but can still fill
  it. There is no server-side storage.
- Ships React's **development** build and runs Babel in the browser — fine for a demo,
  slow and unminified for production.
