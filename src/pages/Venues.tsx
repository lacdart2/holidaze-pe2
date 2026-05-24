import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getVenues, searchVenues } from "../api/venues";
import type { Venue } from "../api/venues";
import VenueCard from "../components/venues/VenueCard";

const PER_PAGE = 9;

const SORT_OPTIONS = [
    { label: "Newest", sort: "created", order: "desc" },
    { label: "Top Rated", sort: "rating", order: "desc" },
    { label: "Price ↑", sort: "price", order: "asc" },
    { label: "Price ↓", sort: "price", order: "desc" },
];

const AMENITY_OPTIONS = [
    { label: "Wifi", key: "wifi" },
    { label: "Parking", key: "parking" },
    { label: "Breakfast", key: "breakfast" },
    { label: "Pets", key: "pets" },
] as const;

type AmenityKey = (typeof AMENITY_OPTIONS)[number]["key"];

export default function Venues() {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialQuery = searchParams.get("q") || "";
    const initialGuests = searchParams.get("guests") || "";

    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState(initialQuery);
    const [guests, setGuests] = useState(initialGuests);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("created");
    const [sortOrder, setSortOrder] = useState("desc");
    const [amenities, setAmenities] = useState<Record<AmenityKey, boolean>>({
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
    });

    useEffect(() => {
        async function fetchVenues() {
            setLoading(true);
            setError("");

            try {
                const activeQuery = searchParams.get("q") || "";
                const activeGuests = searchParams.get("guests") || "";

                setQuery(activeQuery);
                setGuests(activeGuests);

                const res = activeQuery.trim()
                    ? await searchVenues(activeQuery.trim())
                    : await getVenues(sortBy, sortOrder);

                setVenues(res.data);
            } catch {
                setError("Failed to load venues");
            } finally {
                setLoading(false);
            }
        }

        fetchVenues();
    }, [searchParams, sortBy, sortOrder]);

    function handleSortChange(sort: string, order: string) {
        setSortBy(sort);
        setSortOrder(order);
        setPage(1);
    }

    function toggleAmenity(key: AmenityKey) {
        setAmenities((current) => ({
            ...current,
            [key]: !current[key],
        }));
        setPage(1);
    }

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const params = new URLSearchParams();

        if (query.trim()) {
            params.set("q", query.trim());
        }

        if (guests.trim()) {
            params.set("guests", guests.trim());
        }

        setSearchParams(params);
        setPage(1);
    }

    function handleReset() {
        setQuery("");
        setGuests("");
        setAmenities({
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false,
        });
        setSortBy("created");
        setSortOrder("desc");
        setSearchParams({});
        setPage(1);
    }

    const filteredVenues = useMemo(() => {
        const guestsNumber = guests ? Number(guests) : 0;

        return venues.filter((venue) => {
            const matchesGuests = guestsNumber
                ? venue.maxGuests >= guestsNumber
                : true;

            const matchesAmenities = AMENITY_OPTIONS.every((amenity) => {
                if (!amenities[amenity.key]) return true;
                return venue.meta?.[amenity.key] === true;
            });

            return matchesGuests && matchesAmenities;
        });
    }, [venues, guests, amenities]);

    const totalPages = Math.ceil(filteredVenues.length / PER_PAGE);
    const paginated = filteredVenues.slice(
        (page - 1) * PER_PAGE,
        page * PER_PAGE

    );

    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="mb-7">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
                        Explore
                    </p>
                    <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                        All Venues
                    </h1>
                    <p className="mt-2 text-sm font-medium text-stone-500">
                        Search, sort and filter stays that match your trip.
                    </p>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="mb-4 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-[0_4px_20px_rgba(28,25,23,0.10)] sm:flex-row"
                >
                    <input
                        type="text"
                        placeholder="Search venues..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="min-h-[48px] flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400"
                    />

                    <button
                        type="button"
                        onClick={handleReset}
                        className="rounded-xl px-4 py-3 text-sm font-bold text-stone-500 transition-colors duration-200 hover:bg-stone-100 hover:text-stone-700"
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-orange-700"
                    >
                        Search
                    </button>
                </form>

                <div className="mb-8 overflow-x-auto pb-2">
                    <div className="flex min-w-max items-center gap-2">
                        {SORT_OPTIONS.map((option) => {
                            const active =
                                sortBy === option.sort && sortOrder === option.order;

                            return (
                                <button
                                    key={`${option.sort}-${option.order}`}
                                    type="button"
                                    onClick={() =>
                                        handleSortChange(option.sort, option.order)
                                    }
                                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200 ${active
                                        ? "bg-orange-600 text-white"
                                        : "bg-stone-100 text-stone-600 hover:bg-orange-50 hover:text-orange-700"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}

                        <label className="flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-bold text-stone-600">
                            Min guests
                            <input
                                type="number"
                                min="1"
                                value={guests}
                                onChange={(e) => {
                                    setGuests(e.target.value);
                                    setPage(1);
                                }}
                                className="w-14 rounded-xl border border-stone-200 bg-white px-2 py-1 text-sm font-bold text-stone-900 outline-none placeholder:text-stone-400 focus:border-orange-500"
                                placeholder="0"
                            />
                        </label>

                        {AMENITY_OPTIONS.map((amenity) => {
                            const active = amenities[amenity.key];

                            return (
                                <button
                                    key={amenity.key}
                                    type="button"
                                    onClick={() => toggleAmenity(amenity.key)}
                                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200 ${active
                                        ? "bg-orange-600 text-white"
                                        : "bg-stone-100 text-stone-600 hover:bg-orange-50 hover:text-orange-700"
                                        }`}
                                >
                                    {amenity.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {loading && (
                    <div className="rounded-3xl bg-white p-10 text-center shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
                        <p className="text-sm font-medium text-stone-500">
                            Loading venues...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="rounded-3xl bg-white p-10 text-center shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
                        <p className="text-sm font-bold text-red-600">{error}</p>
                    </div>
                )}

                {!loading && !error && filteredVenues.length === 0 && (
                    <div className="rounded-3xl bg-white p-10 text-center shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
                        <p className="text-sm font-medium text-stone-500">
                            No venues found.
                        </p>
                    </div>
                )}

                {!loading && !error && filteredVenues.length > 0 && (
                    <>
                        <div className="mb-5 text-sm font-medium text-stone-500">
                            Showing {filteredVenues.length} venue
                            {filteredVenues.length === 1 ? "" : "s"}
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {paginated.map((venue) => (
                                <VenueCard key={venue.id} venue={venue} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 transition-colors duration-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-30"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={18} className="text-stone-500" />
                                </button>

                                {(() => {
                                    const windowSize = 4;
                                    let start = Math.max(1, page - 1);
                                    let end = start + windowSize - 1;

                                    if (end > totalPages) {
                                        end = totalPages;
                                        start = Math.max(1, end - windowSize + 1);
                                    }

                                    return Array.from(
                                        { length: end - start + 1 },
                                        (_, i) => start + i
                                    ).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPage(p)}
                                            className={`h-10 w-10 rounded-lg text-sm font-bold transition-colors duration-200 ${p === page
                                                ? "bg-orange-600 text-white"
                                                : "border border-stone-200 text-stone-700 hover:bg-orange-50"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ));
                                })()}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((p) => Math.min(totalPages, p + 1))
                                    }
                                    disabled={page === totalPages}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 transition-colors duration-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-30"
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={18} className="text-stone-500" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}