# Holidaze — Accommodation Booking App

> Noroff Project Exam 2 — FED2 AUG24FT — Lakhdar Hafsi

A modern, Airbnb-inspired front-end accommodation booking application built with React, TypeScript and Tailwind CSS v4. Customers can browse and book venues; venue managers can create, edit and manage their properties.

---

## Live Demo

🔗 [holidaze-pe2.vercel.app](https://holidaze-pe2.vercel.app)

## Planning

🔗 [Kanban Board](https://github.com/users/lacdart2/projects/1/views/1)
🔗 [Roadmap / Gantt](https://github.com/users/lacdart2/projects/1/views/2)

## GitHub Repository

🔗 [github.com/lacdart2/holidaze-pe2](https://github.com/lacdart2/holidaze-pe2)

## Figma Design

🔗 [Style Guide + Prototypes](https://www.figma.com/design/8vxNqVOSxpgKXXeKjTtsox/Holidaze-Design?node-id=0-1)

---

## Tech Stack

| Technology              | Version | Purpose               |
| ----------------------- | ------- | --------------------- |
| React                   | 18      | UI framework          |
| TypeScript              | 5       | Type safety           |
| Vite                    | 5       | Build tool            |
| Tailwind CSS            | v4      | Styling               |
| React Router            | v6      | Client-side routing   |
| Zustand                 | latest  | Auth state management |
| Zod                     | latest  | Form validation       |
| React DatePicker        | latest  | Booking calendar      |
| Leaflet / React-Leaflet | latest  | Interactive maps      |
| Lucide React            | latest  | Icons                 |
| Noroff API              | v2      | Backend               |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
git clone https://github.com/lacdart2/holidaze-pe2.git
cd holidaze-pe2
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

No environment variables required. The Noroff API key is generated at runtime via the API.

---

## Project Structure

```
src/
├── api/           # Domain-separated API functions (auth, venues, bookings, profiles)
├── components/
│   ├── common/    # Shared components (StarRating, ConfirmModal)
│   ├── layout/    # Navbar, Footer, Layout
│   └── venues/    # VenueCard, BookingCalendar, VenueMap, VenuesMapSection
├── pages/         # Route-level page components
├── routes/        # AppRouter.tsx — centralised routing
├── store/         # Zustand auth store
└── utils/         # bookingDates.ts, validation.ts, dates.ts, storage.ts
```

---

## Features

### All Users

- Browse and search venues with live debounced search
- Filter venues by amenities (wifi, parking, breakfast, pets) and guest count
- Sort venues by newest, top rated, price ascending/descending
- View venue details with image gallery, amenity badges and host profile
- Interactive Leaflet map — explore venues by location with orange pin markers
- View booking calendar with blocked/available dates
- Register as Customer or Venue Manager (stud.noroff.no email required)

### Customers

- Log in / log out with persistent session (Zustand + localStorage)
- Two-step booking flow — date picker → confirmation modal with price summary → success
- View upcoming bookings in personal dashboard
- Update avatar via URL

### Venue Managers

- Create venues with multi-image support, star rating, amenities and coordinates
- Edit and delete venues with confirmation modal
- View all upcoming bookings for managed venues
- Update avatar via URL

---

## Architecture Decisions

### Routing — React Router v6

Centralised `AppRouter.tsx` with a `<Layout>` wrapper. All pages render via `<Outlet>` so Navbar and Footer appear everywhere without duplication. Protected routes redirect unauthenticated users to login, preserving the original destination in router state.

### State Management — Zustand

Chosen over Redux and React Context for minimal boilerplate and clean TypeScript support. The `authStore` holds user object (name, email, token, venueManager flag) and persists to localStorage automatically. Any component accesses auth state in one line.

### API Layer — Centralised Client

All requests route through `apiFetch()` in `client.ts` which handles: base URL, Bearer token, API key header, Content-Type, error parsing, and the Noroff API edge case where DELETE returns an empty body (handled by checking response status before calling `.json()`).

### Form Validation — Zod

All schemas defined in `src/utils/validation.ts`. Input is validated before any API call, so invalid data never reaches the server. Error messages are user-friendly and associated with specific fields for accessibility.

---

## Design Decisions

### Colour — Orange #EA580C

Warm, energetic, associated with travel and hospitality. Passes WCAG AA contrast on white backgrounds. Distinctive brand identity throughout the app.

### Typography — Plus Jakarta Sans + DM Sans

Plus Jakarta Sans for headings — modern geometric quality, editorial and premium feel. DM Sans for body — designed specifically for UI text, highly readable at small sizes. Together they create clear visual hierarchy.

### Warm Stone Palette

Tailwind `stone-*` tones used instead of `gray-*` throughout. Stone is warm (slightly yellow-brown) vs gray which is cold (slightly blue-tinted). For a travel app, warmth matters — it evokes comfort and hospitality.

### Airbnb-Inspired Layout

Two-column VenueDetails layout (content left, sticky booking card right) follows the industry standard for accommodation booking pages. Users immediately know where to look.

### Role-Based UI

Navbar and redirects adapt based on `venueManager` flag. Customers see bookings dashboard, managers see venue management — no irrelevant UI for either role.

---

## Technical Challenges

### Booking Date Timezone Fix

`Date.toISOString()` converts to UTC, shifting dates backwards for users in UTC+ timezones (Norway is UTC+2). A date selected as May 26 would become May 25T22:00:00Z. Fixed with `toNoonISO()` helper — sets hours to 12:00 before converting. Noon UTC never shifts to the previous day.

### Exclusive Booking Date Ranges

The Noroff API treats booking ranges as `[dateFrom, dateTo)` — the checkout day is not a booked night. Standard `excludeDates` blocked checkout days that should be available as check-in days. Fixed with separate `getBlockedCheckInDates` and `getBlockedCheckOutDates` functions in `bookingDates.ts`.

### BookingCalendar Re-render Freeze

The `getBlockedCheckInDates` and `getBlockedCheckOutDates` functions were called on every render, recreating arrays and triggering react-datepicker re-renders in a loop. Fixed by wrapping both in `useMemo` — arrays only recalculate when `bookings` prop changes.

### DELETE Empty Response Body

The Noroff DELETE endpoint returns empty body with status 200. Calling `.json()` threw "Unexpected end of JSON input". Fixed in `client.ts` by checking response body size before calling `.json()`.

### Tailwind v4 Syntax

Tailwind v4 uses `@import "tailwindcss"` not the v3 `@tailwind` directives. This caused the entire app to lose styles when `index.css` was modified. Documented in codebase comments.

---

## Testing

### Lighthouse — [holidaze-pe2.vercel.app](https://holidaze-pe2.vercel.app)

| Category       | Score  |
| -------------- | ------ |
| Performance    | 60     |
| Accessibility  | 92 ✅  |
| Best Practices | 79     |
| SEO            | 100 ✅ |

Performance score reflects the nature of a React SPA fetching external API images. Server response time is 30ms.

### WAVE Accessibility

| Check           | Result   |
| --------------- | -------- |
| Errors          | 0 ✅     |
| Contrast Errors | 0 ✅     |
| AIM Score       | 10/10 ✅ |

### HTML Validator (validator.w3.org)

| Check    | Result |
| -------- | ------ |
| Errors   | 0 ✅   |
| Warnings | 0 ✅   |

### Manual Testing

All 15 user stories tested and passed on live deployment. See GitHub issue [#32](https://github.com/lacdart2/holidaze-pe2/issues/32).

---

## Known Limitations

- **No user reviews** — Noroff API v2 has no user review endpoint. Venue rating is manager-set only.
- **No payment processing** — booking creates an API record only, no real payment occurs.
- **Basic search** — Noroff search endpoint supports `?q=string` only, no date availability or price range filtering.
- **No booking cancellation** — `DELETE /holidaze/bookings/{id}` exists in the API but cancel UI was deprioritised.
- **Avatar update via URL only** — Noroff API does not support file uploads.
- **Performance** — SPA with 100 venues and external images scores 60 on Lighthouse mobile. Image optimisation would require infrastructure outside project scope.

---

## Accessibility

- WCAG AA compliant colour palette throughout
- All form inputs have visible `<label>` elements (not just placeholders)
- Zod validation errors appear as text below fields, associated with specific inputs
- All images include `alt` attributes
- Semantic HTML — `<form>`, `<main>`, `<section>`, `<nav>` used appropriately
- Lucide React SVG icons (consistent cross-platform, screen reader friendly)
- Keyboard navigation supported
- Disabled button states with `aria` and visual feedback

---

## AI Usage

See [`AI_LOG.md`](./AI_LOG.md) for full documentation of all AI assistance received during this project, including tool used, date, purpose and outcome for each session.
