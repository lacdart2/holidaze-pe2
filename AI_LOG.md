# AI Usage Log — Holidaze PE2

This document explains how I used AI tools during my Project Exam 2 work on Holidaze.

I used AI as a support tool during planning, debugging, UI refinement and documentation. The project was still my responsibility from start to finish. I made the final decisions, tested the code, adapted the suggestions to my own project structure, and only kept code that I understood and could explain.

---

## 2026-05-20

**Tool used:** ChatGPT  
**Purpose:** Project planning and project structure

### What AI helped with

At the beginning of the project, I used ChatGPT to help me understand how to organise the full exam process. This included:

- Breaking the project into phases
- Suggesting a folder structure
- Discussing how to prioritise the required user stories
- Understanding how to structure the exam delivery phases

### What I did myself

I reviewed the suggestions and adapted them to fit the Noroff brief and my own way of working. I created the GitHub repository, set up the project, created the GitHub Projects board and planned the work myself.

### Outcome

This gave me a clear starting point and helped me avoid working randomly without a plan.

---

## 2026-05-20

**Tool used:** Claude  
**Purpose:** Figma design guidance

### What AI helped with

Claude helped me understand the difference between Figma pages and frames. It also suggested suitable desktop frame sizes and explained how to apply a design system consistently.

### What I did myself

I created the Figma desktop prototype myself, including:

- Home page
- Venues page
- Venue details page
- Login page
- Register page

I made the final visual choices myself, including spacing, layout, card proportions and how the design should feel.

### Outcome

The desktop prototype was completed and gave me a visual direction before I started building the app.

---

## 2026-05-21

**Tool used:** Claude  
**Purpose:** Figma mobile design, React setup and architecture explanations

### What AI helped with

Claude helped explain some technical concepts and project structure decisions, including:

- React Router and the `Outlet` pattern
- Why Zustand could be useful for authentication state
- How to centralise API calls in one fetch wrapper
- How to organise API files by domain
- TypeScript errors and what they meant
- Suggested order for creating files based on dependencies

### What I did myself

I built and connected the main project structure myself:

- Vite React project setup
- Tailwind CSS v4 setup
- React Router routing
- API files for auth, venues, bookings and profiles
- Authentication with Zustand
- Login, register and logout flow
- Main pages and dashboards
- Deployment to Vercel

I also created the mobile Figma prototype and adjusted the layout manually.

### Outcome

The main application foundation was created and the first working version was deployed.

---

## 2026-05-23

**Tool used:** ChatGPT  
**Purpose:** V2 UI component improvements

### What AI helped with

After the core functionality was working, I used ChatGPT to help improve some UI components based on my own design system. I gave detailed prompts with the colors, fonts, spacing and style I wanted.

Examples of components where AI helped with suggestions:

- Navbar V2
- Customer dashboard layout
- Manager dashboard layout
- Home page venue sections
- Venues page sort and filter bar
- Search bar styling
- Rating badge styling

### What I did myself

I pasted my own code with some clear errors on it either in tailwind or in useffects or missing imports, ChatGPT reviewed and suggested changes and explained why and how, the generated code is always tested before adding it to the project. I changed class names, fixed mistakes, adapted components to my existing file structure and tested everything locally.

Some suggestions did not fit the project, so I changed or removed them. I did not treat the output as final code.

### Outcome

The UI became more consistent, responsive and closer to the final warm Airbnb-inspired design direction.

---

## 2026-05-23 to 2026-05-24

**Tool used:** Claude  
**Purpose:** Pair programming, debugging, final UI pass and documentation support

### What AI helped with

Claude helped as a pair-programming assistant during the final development phase. The help was mostly around debugging, improving existing code and checking edge cases.

Main areas where Claude helped:

- Navbar responsive behavior and hamburger menu
- Password show/hide toggle on login and register
- VenueCard visual improvements
- Home page sections: Popular, Top Rated, Newest and Most Popular
- Venues page sorting and filtering
- CreateVenue and EditVenue image handling
- VenueDetails rating and max guest display
- Reusable StarRating component
- BookingCalendar date blocking logic
- Booking calendar freeze issue
- Leaflet map marker issue in Vite
- README structure
- Reflection draft review

### What I did myself

I controlled the implementation and final decisions. I tested the features locally, checked the behavior in the browser, fixed issues after seeing them in the UI, and committed the work step by step.

I also wrote the git commit messages myself and decided what should be pushed. When AI suggested code, I compared it with my existing code before using it.

### Outcome

The project reached a complete final version with all core user stories implemented, V2 design improvements added, and the app deployed.

---

## Important Examples of My Own Problem Solving

Even when AI helped with explanations or suggestions, some important issues required me to test, understand and adjust the solution myself.

### Booking date timezone problem

I found that dates could shift because `Date.toISOString()` converts to UTC. This could send the wrong booking date to the API. I fixed this by using a helper that sets the time to noon before converting the date.

### Checkout date logic

I had to understand that the checkout date is not a booked night. This meant I needed different logic for check-in and checkout dates, instead of blocking every date in the same way.

### Booking calendar freeze

The booking calendar froze because blocked date arrays were being recreated on every render. I fixed this by using `useMemo()` so the arrays only update when the bookings change.

### Tailwind CSS v4

I had to learn and remember that Tailwind v4 uses:

```css
@import "tailwindcss";
```

instead of the older Tailwind v3 directives.

### Vercel and TypeScript errors

Some errors only appeared during deployment. After that, I started running build checks locally before pushing changes.

---

## How AI Was Used

AI was used as:

- A planning assistant
- A debugging helper
- A code review partner
- A UI suggestion tool
- A documentation support tool

AI was not used as a replacement for my own work. I did not add code that I could not explain. All final decisions about structure, design, testing and delivery were made by me.

---

## Final Note

This log is included to be transparent about AI use in the project. AI helped me work faster and think through some problems more clearly which some I was not aware of, but I still had to understand the project, integrate the code, test the features and make the final decisions myself.
