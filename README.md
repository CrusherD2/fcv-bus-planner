# FCV Bus Planner (Mobile Web App)

This is a **mobile-first web app** for Flamingo Crossings bus planning, designed to work great on your phone.

## Features

- Ask-like flow:
  - Where are you now?
  - Where are you going?
  - What time do you need to arrive or leave (time only, no date picker)?
- Travel modes:
  - **Arrive By**
  - **Leave At**
- Time handling:
  - Uses **Winter Garden timezone** (`America/New_York`) for all planning and "current time"
- Planner output:
  - Best route option
  - Route badge(s), departure, arrival, trip time
  - Transfer details (if needed)
  - Alternative options
  - Live countdown in Leave At mode
  - Neatly listed stop-by-stop timeline for each suggested leg
- Route fidelity:
  - Routes are modeled as **left-to-right multi-stop chains** from each schedule row
  - Example: Route B rows include FCV East → FCV West → Hollywood Studios → ESPN → Blizzard Beach → Coronado Springs → FCV East
  - Example: Route E distinguishes Magic Kingdom West Clock and TTC columns
  - Route D includes intermediate Animal Kingdom-area stops (Costuming, Lodge, Park Cast Services)
- Route browser:
  - Pick a specific route (A/B/C/D/E/G/H/I/J/K) and view today's full schedule neatly
  - Route list is compact by default; tap a time row to expand full stop-by-stop details
- Quick actions:
  - Now
  - +30 min
  - +1 hr
  - Tonight 10 PM
- Works well on mobile browsers and supports install-like behavior through PWA manifest/service worker.

## Schedule coverage

- Seeded from the uploaded **Flamingo Buses PDF**.
- Includes route datasets for:
  - **A, B, C, D, E, G, H, I, J, K**
- Route A day rule is handled:
  - **Mon-Tue**: Super Target
  - **Wed-Sun**: Walmart

> Note: Published bus times are approximate and can vary by around 5 minutes.

## Run locally

Open `index.html` directly in a browser, or use a small static server:

```bash
python3 -m http.server 8080
```

Then open:

```
http://localhost:8080
```

## Put it online (GitHub Pages)

1. Push this repo to GitHub.
2. In repo settings, enable **Pages** from the branch root (`/`).
3. Open the generated Pages URL on your phone.

## Main files

- `index.html` – app structure
- `styles.css` – modern mobile UI styling
- `schedule-data.js` – extracted full route-run schedule data
- `app.js` – schedule data + route planner logic
- `manifest.webmanifest` – install metadata
- `service-worker.js` – basic offline caching