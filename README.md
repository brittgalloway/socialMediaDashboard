# Social Media Dashboard

A [Frontend Mentor](https://www.frontendmentor.io/challenges/social-media-dashboard-with-theme-switcher-6oY8ozp_H) challenge built as a practice project exploring Alpine.js, CSS Grid, and end-to-end testing with Playwright.

[Live Demo](https://brittgalloway.github.io/socialMediaDashboard/)

---

## The Challenge

Build a responsive social media dashboard with a light/dark theme switcher. Users should be able to:

- View the optimal layout depending on their device's screen size
- Toggle between light and dark color themes
- See hover states for all interactive elements

---

## Built With

- **[Alpine.js](https://alpinejs.dev/)** (CDN) — reactive data, dark mode state, tooltip logic
- **Vanilla CSS** — custom properties, native nesting, CSS Grid, mobile-first
- **[Playwright](https://playwright.dev/)** — end-to-end testing across Chromium, Firefox, and mobile viewports
- **Inter** via Google Fonts

---

## What I Focused On

### Alpine.js as a lightweight reactive layer
Rather than reaching for a full framework, Alpine handles everything this project needs in a single `dashboard()` function — the followers data, overview data, dark mode boolean, and tooltip state all live in one place. The template uses `x-for` to render both card grids from the data arrays, keeping the HTML clean and the data easy to update.

The `totalFollowers` value is a getter on the Alpine data object, so it stays reactive and automatically handles the `11k` shorthand by converting it before summing.

### Dark mode with CSS custom properties
All theme values are defined as custom properties on `:root` and overridden by a `.dark` class on `<body>`. Toggling the theme is a single `dark = !dark` in Alpine — CSS does the rest. Every color transition is animated so the swap feels smooth rather than jarring.

The toggle uses `role="switch"` with `:aria-checked` bound to the `dark` boolean, which is the correct ARIA pattern for this kind of control. Screen readers announce it as "Dark Mode, switch, on/off" rather than just "button".

One CSS quirk worth noting: custom properties can't hold gradient values, so the dark mode toggle gradient targets `.dark .theme-toggle__track` directly rather than going through a variable.

### Responsive CSS Grid
The card grids follow a three-step breakpoint progression:

| Viewport | Columns |
|---|---|
| `< 600px` | 1 |
| `≥ 600px` | 2 |
| `≥ 1024px` | 4 |

The two-column tablet breakpoint makes the layout feel intentional at mid-sizes rather than snapping straight from stacked to four-across.

### Tooltip positioning
Clicking any card triggers a "Display only" tooltip to clarify the data isn't live. Rather than a fixed bottom-center position, the tooltip calculates its coordinates from `getBoundingClientRect()` on the clicked card — centering horizontally over it and appearing just above (falling back to below if the card is near the top of the viewport). Edge clamping prevents it from bleeding off either side of the screen.

The tooltip uses `role="status"` and `aria-live="polite"` so screen readers announce it without interrupting whatever the user is currently hearing.

### Accessibility throughout
- Semantic landmarks — `<header>`, `<main>`, `<footer>` with labelled sections
- `maximum-scale=5.0` on the viewport meta tag — never block user zoom
- Cards use `role="button"` and `tabindex="0"` with keyboard event handlers so they're fully reachable without a mouse
- The follower section has a visually hidden `<h2>` so it reads as a named region to screen readers
- Decorative images carry `alt=""` and `aria-hidden="true"`
- All interactive elements have visible `:focus-visible` styles

---

## Playwright Tests

27 tests across 5 groups covering:

- **Theme** — default is light, toggle switches to dark and back, `aria-checked` reflects state, keyboard accessible
- **Follower cards** — correct count (4), platforms, follower numbers, handles, change colours, total followers sum
- **Overview cards** — correct count (8), metrics, counts, up/down change colours
- **Tooltip** — hidden on load, appears on click and keyboard trigger, dismisses after 1 second, timer resets on rapid clicks, positioned near the triggered card
- **Responsive grid** — 1/2/4 column layout verified at 375px, 700px, and 1280px viewports


### Running the tests

```bash
npm install
npx playwright install chromium firefox
npm test              # headless
npm run test:headed   # watch the browser
npm run test:ui       # Playwright interactive UI
npm run test:report   # view last HTML report
```

---

## Running Locally

No build step — plain HTML, CSS, and JS.

```bash
git clone https://github.com/brittgalloway/socialMediaDashboard.git
cd socialMediaDashboard
npx serve .
```

Then open `http://localhost:3000`.

---

## Project Structure

```
socialMediaDashboard/
├── images/
│   ├── icon-facebook.svg
│   ├── icon-twitter.svg
│   ├── icon-instagram.svg
│   ├── icon-youtube.svg
│   ├── icon-up.svg
│   ├── icon-down.svg
│   └── favicon-32x32.png
├── tests/
│   └── dashboard.spec.js
├── index.html
├── style.css
├── playwright.config.js
├── package.json
└── README.md
```

---

## Acknowledgements

- Challenge by [Frontend Mentor](https://www.frontendmentor.io)
- Coded by [Brittney Galloway](https://github.com/brittgalloway)