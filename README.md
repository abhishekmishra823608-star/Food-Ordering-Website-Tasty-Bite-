# 🍔 TastyBite — Food Ordering Website (Frontend-Only)

A fully responsive food ordering website built with **HTML5, CSS3, and Vanilla JavaScript only**
— no backend server required. All "API" behavior (menu data, login/register, placing orders,
order history) is simulated in the browser using a static data file and `localStorage`.

## Project Structure

```
food-order-website/
│── index.html            → Home page
│── menu.html               → Menu page (search / filter / sort)
│── food-details.html      → Single food item page
│── cart.html               → Cart page
│── checkout.html          → Checkout page (form + order review)
│── login.html              → Login page
│── register.html          → Register page
│── order-success.html     → Order confirmation page
│── order-history.html     → Bonus: order history page
│
│── css/
│   └── style.css           → All styling (theme, layout, responsive, animations, dark mode)
│
│── js/
│   ├── foods-data.js        → Static menu data (15 items, 5 categories) — replaces a real DB
│   ├── config.js             → Mock "API" layer — see below
│   ├── utils.js               → Toast, cart/wishlist localStorage helpers
│   ├── nav.js                  → Hamburger menu, dark mode, navbar auth state
│   ├── main.js                  → Home page logic
│   ├── menu.js                   → Menu page logic
│   ├── food-details.js          → Food details page logic
│   ├── cart.js                    → Cart page logic
│   ├── checkout.js               → Checkout form + order submission
│   ├── auth.js                    → Login & register logic
│   ├── order-success.js          → Order confirmation logic
│   └── order-history.js          → Order history logic
│
└── images/                  → (Images are loaded from Unsplash URLs; folder kept for your own assets)
```

## How "Backend" Features Work Without a Server

`js/config.js` exposes an `apiRequest(endpoint, options)` function with the **exact same
signature** a real fetch-based API client would have. Every page calls it just like it would
call a real backend:

```js
await apiRequest('/foods');
await apiRequest('/foods/3');
await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
await apiRequest('/orders', { method: 'POST', body: JSON.stringify({ customer, items, total }) });
await apiRequest('/orders?email=you@example.com');
```

Internally, instead of doing a `fetch()` to a server, it:
- Reads menu items from `FOODS_DATA` (in `foods-data.js`)
- Reads/writes registered users to `localStorage` under the key `mockUsers`
- Reads/writes placed orders to `localStorage` under the key `mockOrders`
- Hashes passwords with the browser's built-in `crypto.subtle.digest('SHA-256', ...)` before
  storing them (still not real security — see note below)
- Adds a small artificial delay so loading spinners are visible, just like a real network call

Because the function signature matches, **every other JS file (menu, cart, checkout, auth,
order history) works completely unchanged** — they have no idea there's no server behind them.

⚠️ **Important limitation:** since everything lives in `localStorage`, your "account" and order
history are only visible in the same browser on the same device — there's no real server, so
data isn't shared across devices or browsers, and it can be cleared if the user clears site data.
This is intentional for a frontend-only demo. For real accounts and persistent, shared data,
you'd need an actual backend (see the full-stack version of this project).

## How to Run Locally

No installation needed — it's plain static HTML/CSS/JS. Two options:

**Option 1 — Just open it**
Double-click `index.html` to open it directly in your browser. (Some browsers restrict
`crypto.subtle` and other features on the `file://` protocol, so Option 2 is recommended.)

**Option 2 — Serve it locally (recommended)**
From the project folder, run any simple static server, for example:

```bash
# Using Python 3 (built into macOS/Linux, installable on Windows)
python3 -m http.server 8080

# OR using Node.js
npx serve .
```

Then open your browser at `http://localhost:8080`.

## Features Implemented

- Responsive navbar with hamburger menu on mobile
- Hero section with promo banner and animated floating image
- Food categories grid, linking into filtered menu views
- Search + category filter + price/rating sort on the Menu page
- Food detail page with quantity selector and related items
- Cart with quantity +/-, remove, promo code, dynamic totals (subtotal, tax, delivery fee)
- Checkout form with client-side validation and payment method selection
- Login / Register with validation and toast feedback (stored in `localStorage`)
- Order confirmation page showing the order ID and summary
- **Bonus:** Dark mode toggle, wishlist (heart icon on cards), loading spinners, toast
  notifications, order history page (per-browser)

## Design

- Colors: Orange `#ff6b35` (primary), White, Dark Gray `#2d2d2d`
- Font: Poppins (Google Fonts)
- Mobile-first, fully responsive (tested down to ~360px width)
- Smooth scroll, card hover/lift animations, fade-in/slide-in transitions

## Upgrading to a Real Backend Later

Since every page only ever calls `apiRequest(endpoint, options)`, adding a real backend later is
just a matter of replacing the body of that one function in `config.js` with a real `fetch()`
call to your server — nothing else in the project needs to change.
