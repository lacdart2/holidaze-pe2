import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getVenues } from "../api/venues";
import type { Venue } from "../api/venues";
import VenueCard from "../components/venues/VenueCard";

export default function Home() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchVenues() {
            try {
                const res = await getVenues();
                // show only first 6 on home page
                setVenues(res.data.slice(0, 6));
            } catch (err) {
                console.error("Failed to load venues");
            }
        }
        fetchVenues();
    }, []);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/venues?q=${query}`);
        }
    }

    return (
        <div>
            <section className="flex flex-col items-center justify-center bg-gray-100 px-6 py-24 text-center">
                <h1 className="font-bold text-5xl text-gray-900 mb-4">
                    Find Your Perfect Stay
                </h1>
                <p className="text-gray-500 text-lg mb-8">
                    Discover unique venues around the world
                </p>

                <form onSubmit={handleSearch} className="flex gap-3 w-full max-w-xl">
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
                </form>
            </section>
            {/* popular venues */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-2xl text-gray-900">Popular Venues</h2>
                    <Link
                        to="/venues"
                        className="text-orange-600 hover:underline text-sm"
                    >
                        View all
                    </Link>
                </div>
                {venues.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">Loading venues...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venues.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}