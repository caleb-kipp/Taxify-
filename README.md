# OnDemand Boda‑Taxi — Mega Launch Repo

## Quick Start
- Frontend demo: open `index.html` in a browser for an interactive mock.
- Node backend: `node server.js` (requires express + socket.io). Endpoints: `/api/drivers`, `/api/book`.
- Flask webhook: `python3 server.py` to accept payment notifications.

## MVP Feature Mapping
- Core: map, pickup/dropoff, driver listing, estimate, request flow.
- Phase 2: payment integration (M‑Pesa, Stripe), scheduling, multi‑stop.
- Phase 3: dynamic pricing, AI route optimization, multi‑region infra.

## Notes
This bundle is a starting scaffold — security, persistence (DB), real payment gateway integration, identity/KYC, and regulatory compliance must be implemented before production.