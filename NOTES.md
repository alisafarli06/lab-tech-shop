# Notes: my design log

**Live URL (Vercel):** https://lab-tech-shop-gamma.vercel.app/

## 1. Route and storage choice

- **Route:** `/premium` at `app/premium/page.js`. The navbar already links there, so I kept that path instead of inventing a new one.
- **Storage:** `localStorage` with key `techcart-premium` (see `lib/premium.js`).
- **Why localStorage:** The product owner wants ads to stay gone after refresh *and* when the user comes back later. `sessionStorage` would forget when the tab closes. Cookies would work too, but they add server/header complexity we do not need for a client-only mock payment. `localStorage` is simple, survives reloads, and is easy to read from Client Components.

## 2. Server vs Client Components

| File | Type | Notes |
|------|------|-------|
| `app/layout.js` | **Server** | Root layout; no browser APIs needed |
| `app/page.js` | **Server** | Static product grid from data |
| `app/components/Navbar.js` | **Server** | Links only, no interactivity |
| `app/premium/page.js` | **Client** | Form state, `onSubmit`, writes `localStorage` |
| `app/components/AdBanner.js` | **Client** | Must read `localStorage` and react when premium changes |
| `lib/premium.js` | **Shared util** | Guards `window` for safe imports |

**Forced Client:** `AdBanner` and the premium page need the browser (`localStorage`, events, React state). **Kept on server:** the shop home page and navbar stay Server Components so product HTML is rendered on the server without shipping extra client JS for pages that do not need it.

## 3. The first-render problem

- **Risk:** If `AdBanner` or the premium page read `localStorage` during the first render, the server would always render "not premium" while the client might render "premium" — a hydration mismatch.
- **Fix:** Both components start from a safe default (`showAds = true`, `paid = false`). A `useEffect` runs after mount, reads `localStorage`, and updates state. Server and first client render always agree.
- **Verified:** Run `npm run dev`, open the console, submit the form, refresh — no hydration warnings. Ads hide after submit and stay hidden after reload.

## 4. How the pieces connect

User fills out the controlled form on `/premium` and submits. `setPremium()` writes `techcart-premium=true` to `localStorage` and dispatches a custom event. `AdBanner` hears that event (or reads storage on mount) and sets `showAds` to false, so both banners unmount. On refresh, `AdBanner`'s `useEffect` reads the same flag and keeps the ads hidden.

## 5. Extra credits implemented

- **Form Validation**: Form fields (Cardholder name, Card number length 13-19, MM/YY expiry date and expiry checks, and CVC length 3-4) are validated on the client side with helpful error warnings.
- **Restore Ads button**: Added a "Restore ads (Cancel Premium)" button on the confirmation screen that clears the storage key and updates the state immediately across the app.
- **Active Navigation Highlighting**: Navbar links now change color/style dynamically when active using `usePathname`.
- **Premium Badge**: A "⭐ Premium" badge appears next to the logo, and the premium button changes to a green "Premium ✓" state when active.
- **Two plans option**: Users can now select between a "Monthly Plan" ($9.99/mo) and a "Lifetime Plan" ($49.99 one-time). Their plan selection is stored in `localStorage` and displayed dynamically in the success confirmation and in the Navbar badge (e.g., "⭐ Premium (lifetime)").
