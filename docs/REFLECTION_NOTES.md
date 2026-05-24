## Search Implementation Note

Used debounced live search instead of form submit approach.
The Noroff API supports search via GET /holidaze/venues/search?q=
Results update as user types with a 400ms delay to avoid too many API calls.
This approach improves UX compared to clicking a search button.
Mention in reflection: considered real-time filtering, chose debounced API search as a balance between UX and performance.
Used profile API endpoint to enrich venue details with host bio, venue count and booking count.

Replaced number input with +/- guest counter. Unified date display and guest selection into one card.

Login/Register card: border removed → soft shadow 0_8px_40px_rgba(28,25,23,0.10)
Background: bg-gray-50 → gradient orange-50 to white
Eye icon on password fields
For the reflection report:

Rating system decision — Noroff API v2 has no user review endpoint. Rating is manager-set only. Chose to display stars as read-only UI rather than mislead users with fake interactivity. Honest API constraint handling.
AI collaboration approach — Used Claude for architecture/planning and prompts, ChatGPT for UI generation, then compared outputs and kept the best. Documented all AI use in AI_LOG.md per assignment rules.
ChatGPT vs Claude for UI — ChatGPT produced cleaner component rewrites (Navbar, Dashboards) when given detailed design system prompts. Claude was stronger for logic, planning, and debugging.
Design decisions — Upgraded from Figma prototypes (basic) to V2 Airbnb-inspired design in code. Fonts upgraded from Poppins to Plus Jakarta Sans + DM Sans. Decided to update Figma to match code rather than downgrade code.
Technical challenges — ConfirmModal.tsx was never git tracked causing Vercel build failures. Tailwind v4 syntax difference (@import "tailwindcss" not v3 config). Booking date timezone fix with toNoonISO().
Search implementation — Debounced live search chosen over form submit for better UX. Multi-field hero search added beyond original scope.

Remind me tomorrow when we write the PDF and I'll turn these into proper reflection paragraphs.
