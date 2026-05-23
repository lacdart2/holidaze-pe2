/* import { useEffect, useState } from "react";
import { getVenues, searchVenues } from "../api/venues";
import type { Venue } from "../api/venues";
import VenueCard from "../components/venues/VenueCard";

export default function Venues() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    // fetch all venues 
    useEffect(() => {
        async function fetchVenues() {
            try {
                const res = await getVenues();
                setVenues(res.data);
            } catch (err) {
                setError("Failed to load venues");
            } finally {
                setLoading(false);
            }
        }
        fetchVenues();
    }, []);

    // search venues
    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await searchVenues(query);
            setVenues(res.data);
        } catch (err) {
            setError("Search failed");
        } finally {
            setLoading(false);
        }
    }

    // reset search
    async function handleReset() {
        setQuery("");
        setLoading(true);
        try {
            const res = await getVenues();
            setVenues(res.data);
        } catch (err) {
            setError("Failed to load venues");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="font-bold text-3xl text-gray-900 mb-6">All Venues</h1>

            <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                <input
                    type="text"
                    placeholder="Search venues..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
                <button
                    type="submit"
                    className="flex items-center bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 cursor-pointer"
                >
                    Search
                </button>
                {query && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center border px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                        Reset
                    </button>
                )}
            </form>

            {loading && (
                <p className="text-gray-500 text-center py-10">Loading venues...</p>
            )}

            {error && (
                <p className="text-red-500 text-center py-10">{error}</p>
            )}

            {!loading && !error && venues.length === 0 && (
                <p className="text-gray-500 text-center py-10">No venues found.</p>
            )}

            {!loading && !error && venues.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.map((venue) => (
                        <VenueCard key={venue.id} venue={venue} />
                    ))}
                </div>
            )}
        </div>
    );
} */
import { useEffect, useState } from "react";
import { getVenues, searchVenues } from "../api/venues";
import type { Venue } from "../api/venues";
import VenueCard from "../components/venues/VenueCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PER_PAGE = 9;

export default function Venues() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchVenues() {
            try {
                const res = await getVenues();
                setVenues(res.data);
            } catch {
                setError("Failed to load venues");
            } finally {
                setLoading(false);
            }
        }
        fetchVenues();
    }, []);

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setPage(1);
        try {
            const res = await searchVenues(query);
            setVenues(res.data);
        } catch {
            setError("Search failed");
        } finally {
            setLoading(false);
        }
    }

    async function handleReset() {
        setQuery("");
        setPage(1);
        setLoading(true);
        try {
            const res = await getVenues();
            setVenues(res.data);
        } catch {
            setError("Failed to load venues");
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(venues.length / PER_PAGE);
    const paginated = venues.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <h1 className="font-bold text-3xl text-gray-900 mb-6">All Venues</h1>

            <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                <input
                    type="text"
                    placeholder="Search venues..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
                <button
                    type="submit"
                    className="flex items-center bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 cursor-pointer"
                >
                    Search
                </button>
                {query && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center border px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    >
                        Reset
                    </button>
                )}
            </form>

            {loading && <p className="text-gray-500 text-center py-10">Loading venues...</p>}
            {error && <p className="text-red-500 text-center py-10">{error}</p>}
            {!loading && !error && venues.length === 0 && (
                <p className="text-gray-500 text-center py-10">No venues found.</p>
            )}

            {!loading && !error && venues.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginated.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-10">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex items-center justify-center w-10 h-10 rounded-xl border border-stone-200 hover:bg-orange-50 disabled:opacity-30 cursor-pointer transition-colors duration-200"
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
                                return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium cursor-pointer transition-colors duration-200 ${p === page
                                            ? "bg-orange-600 text-white"
                                            : "border border-stone-200 hover:bg-orange-50 text-stone-700"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ));
                            })()}

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="flex items-center justify-center w-10 h-10 rounded-xl border border-stone-200 hover:bg-orange-50 disabled:opacity-30 cursor-pointer transition-colors duration-200"
                            >
                                <ChevronRight size={18} className="text-stone-500" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}