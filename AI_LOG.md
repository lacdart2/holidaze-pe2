# AI Usage Log — Holidaze PE2

All AI assistance received during this project is documented here honestly.

---

## 2026-05-20

**Tool used:** ChatGPT
**Purpose:** Project planning and architecture discussion
**What ChatGPT helped with:**

- Explained phase-by-phase approach for organising the project
- Suggested folder structure options and discussed tradeoffs
- Helped think through exam requirements and how to prioritise tasks

**What I did:**

- Reviewed the suggestions and adapted them to match the exam brief
- Made final decisions on folder structure and phases
- Created the GitHub repo, Kanban board, and roadmap myself

**Outcome:** Clear working plan ready to follow

---

## 2026-05-20

**Tool used:** Claude (claude.ai)
**Purpose:** Figma Desktop Prototype — layout and design guidance
**What Claude helped with:**

- Explained the difference between Figma pages and frames
- Provided frame size recommendations for desktop (1440x1024px)
- Explained design system usage (colors, fonts, spacing) in practice

**What I built:**

- Created all 5 desktop frames myself in Figma (Home, Venues, Venue Details, Login, Register)
- Made visual decisions — left-aligned hero text, card heights, spacing
- Adjusted card proportions based on how they looked in the canvas

**Outcome:** All 5 desktop frames completed on Figma Page 2 (Desktop Prototype)

## Session — 2026-05-21

**Tool used:** Claude (claude.ai)
**Purpose:** Guidance and explanations during Figma design and coding sessions
**What Claude helped with:**

- Explained Figma frame vs page concept and guided placement of elements
- Suggested layout specs for mobile and desktop prototypes
- Explained React Router v6 Outlet pattern and how nested routes work
- Explained Zustand and why it fits better than prop drilling for auth state
- Helped debug TypeScript lint errors and explained what each error meant
- Suggested folder structure and file creation order based on dependencies
- Explained API fetch wrapper pattern and why we centralize headers

**What I built:**

- Figma mobile prototype — 4 frames with consistent design system
- API layer — client, auth, venues, bookings, profiles
- Full routing setup with React Router v6
- Auth system with Zustand — register, login, logout, localStorage
- All app pages — Home, Venues, VenueDetails, Login, Register, dashboards, venue management
- Navbar with user avatar dropdown
- Custom favicon
- Deployed app to Vercel

**Outcome:** App is live on Vercel. All core user stories implemented and functional.
