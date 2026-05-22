## Search Implementation Note

Used debounced live search instead of form submit approach.
The Noroff API supports search via GET /holidaze/venues/search?q=
Results update as user types with a 400ms delay to avoid too many API calls.
This approach improves UX compared to clicking a search button.
Mention in reflection: considered real-time filtering, chose debounced API search as a balance between UX and performance.
