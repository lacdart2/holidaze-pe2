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
            <form onSubmit={handleSearch} className="flex gap-2 mb-8 bg-white rounded-2xl shadow-[0_4px_20px_rgba(28,25,23,0.10)] p-2">
                <input
                    type="text"
                    placeholder="Search venues..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-4 py-3 text-sm outline-none bg-transparent text-stone-900 placeholder-stone-400 rounded-xl"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 text-sm text-stone-500 hover:text-stone-700 transition-colors duration-200 cursor-pointer"
                    >
                        Clear
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors duration-200 cursor-pointer font-medium text-sm whitespace-nowrap"
                >
                    Search
                </button>
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