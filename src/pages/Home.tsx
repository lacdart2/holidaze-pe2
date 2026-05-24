import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, MapPin, Search, ShieldCheck, Star, Users } from "lucide-react";
import { getVenues } from "../api/venues";
import type { Venue } from "../api/venues";
import VenueCard from "../components/venues/VenueCard";
import { useAuthStore } from "../store/authStore";

const HOLIDAZE_VENUES_URL = "https://v2.api.noroff.dev/holidaze/venues";

type VenueWithCount = Venue & {
    _count?: {
        bookings?: number;
    };
};

interface VenueSectionProps {
    label: string;
    title: string;
    venues: Venue[];
    loading: boolean;
}

// show span with total media
function hasMedia(venue: Venue) {
    return Boolean(venue.media && venue.media.length > 0 && venue.media[0]?.url);
}

async function fetchVenuesByUrl(url: string): Promise<VenueWithCount[]> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to load venues");
    }

    const result = await response.json();
    return result.data;
}

function VenueSection({ label, title, venues, loading }: VenueSectionProps) {
    return (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
                        {label}
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
                        {title}
                    </h2>
                </div>

                <Link
                    to="/venues"
                    className="text-sm font-bold text-orange-600 transition-colors duration-200 hover:text-orange-700 hover:underline"
                >
                    View all →
                </Link>
            </div>

            {loading ? (
                <div className="rounded-3xl bg-white p-10 text-center shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
                    <p className="text-sm font-medium text-stone-500">
                        Loading venues...
                    </p>
                </div>
            ) : venues.length === 0 ? (
                <div className="rounded-3xl bg-white p-10 text-center shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
                    <p className="text-sm font-medium text-stone-500">
                        No venues found.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {venues.map((venue) => (
                        <VenueCard key={venue.id} venue={venue} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default function Home() {
    const [popularVenues, setPopularVenues] = useState<Venue[]>([]);
    const [topRatedVenues, setTopRatedVenues] = useState<Venue[]>([]);
    const [newestVenues, setNewestVenues] = useState<Venue[]>([]);
    const [mostPopularVenues, setMostPopularVenues] = useState<Venue[]>([]);
    const [loadingPopular, setLoadingPopular] = useState(true);
    const [loadingTopRated, setLoadingTopRated] = useState(true);
    const [loadingNewest, setLoadingNewest] = useState(true);
    const [loadingMostPopular, setLoadingMostPopular] = useState(true);

    const [query, setQuery] = useState("");
    const [guests, setGuests] = useState("");

    const navigate = useNavigate();
    const { user } = useAuthStore();

    useEffect(() => {
        async function fetchPopularVenues() {
            try {
                const res = await getVenues();
                setPopularVenues(res.data.filter(hasMedia).slice(0, 6));
            } catch (err) {
                console.error("Failed to load popular venues");
            } finally {
                setLoadingPopular(false);
            }
        }

        async function fetchTopRatedVenues() {
            try {
                const data = await fetchVenuesByUrl(
                    `${HOLIDAZE_VENUES_URL}?sort=rating&sortOrder=desc&limit=6`
                );

                setTopRatedVenues(
                    data.filter((venue) => hasMedia(venue) && venue.rating > 0).slice(0, 6)
                );
            } catch (err) {
                console.error("Failed to load top rated venues");
            } finally {
                setLoadingTopRated(false);
            }
        }

        async function fetchNewestVenues() {
            try {
                const data = await fetchVenuesByUrl(
                    `${HOLIDAZE_VENUES_URL}?sort=created&sortOrder=desc&limit=6`
                );

                setNewestVenues(data.filter(hasMedia).slice(0, 6));
            } catch (err) {
                console.error("Failed to load newest venues");
            } finally {
                setLoadingNewest(false);
            }
        }

        async function fetchMostPopularVenues() {
            try {
                const data = await fetchVenuesByUrl(
                    `${HOLIDAZE_VENUES_URL}?limit=100&_bookings=true`
                );

                const sorted = data
                    .filter(hasMedia)
                    .sort(
                        (a, b) =>
                            (b._count?.bookings || 0) - (a._count?.bookings || 0)
                    )
                    .slice(0, 6);

                setMostPopularVenues(sorted);
            } catch (err) {
                console.error("Failed to load most popular venues");
            } finally {
                setLoadingMostPopular(false);
            }
        }

        fetchPopularVenues();
        fetchTopRatedVenues();
        fetchNewestVenues();
        fetchMostPopularVenues();
    }, []);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();

        const params = new URLSearchParams();

        if (query.trim()) {
            params.set("q", query.trim());
        }

        if (guests.trim()) {
            params.set("guests", guests.trim());
        }

        navigate(`/venues${params.toString() ? `?${params.toString()}` : ""}`);
    }

    return (
        <div className="min-h-screen bg-[#FAFAF9]">
            <section className="flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 via-white to-[#FAFAF9] px-4 py-20 text-center sm:px-6 sm:py-24">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-orange-600">
                    Holidaze
                </p>

                <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
                    Find Your Perfect Stay
                </h1>

                <p className="mt-4 max-w-2xl text-base font-normal leading-7 text-stone-500 sm:text-lg">
                    Discover warm cabins, city apartments and unique venues around the world.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="mt-9 w-full max-w-3xl rounded-2xl bg-white p-2 text-left shadow-[0_8px_30px_rgba(28,25,23,0.10)]"
                >
                    <div className="grid gap-2 sm:grid-cols-[1.5fr_0.8fr_auto]">

                        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-2.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all duration-200">
                            <MapPin size={16} className="text-orange-600 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search city, country or venue"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent text-sm text-stone-900 outline-none rounded-lg px-2 py-2 placeholder:text-stone-400"
                            />
                        </div>

                        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-2.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all duration-200">
                            <Users size={16} className="text-orange-600 shrink-0" />
                            <input
                                type="number"
                                min="1"
                                placeholder="Guests"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                className="w-full bg-transparent text-sm text-stone-900 outline-none rounded-lg px-2 py-2 placeholder:text-stone-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_12px_rgba(234,88,12,0.25)] transition-all duration-200 hover:bg-orange-700 cursor-pointer"
                        >
                            <Search size={18} />
                            Search
                        </button>
                    </div>
                </form>

            </section>

            <VenueSection
                label="Explore"
                title="Popular Venues"
                venues={popularVenues}
                loading={loadingPopular}
            />

            <VenueSection
                label="Top Rated"
                title="Highest Rated Stays"
                venues={topRatedVenues}
                loading={loadingTopRated}
            />

            <VenueSection
                label="Just Added"
                title="Newest Venues"
                venues={newestVenues}
                loading={loadingNewest}
            />

            <VenueSection
                label="Most Booked"
                title="Most Popular"
                venues={mostPopularVenues}
                loading={loadingMostPopular}
            />

            {/* Trust section */}
            {/* Trust section */}
            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-orange-600 mb-2">Why Holidaze</p>
                <h2 className="text-center text-2xl font-extrabold text-stone-900 mb-8 sm:text-3xl">Travel with confidence</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {[
                        { icon: <ShieldCheck size={24} className="text-orange-600" />, stat: "500+", title: "Verified Venues", desc: "Every host reviewed and approved before listing" },
                        { icon: <Lock size={24} className="text-orange-600" />, stat: "100%", title: "Secure Booking", desc: "Safe and encrypted payments on every booking" },
                        { icon: <Star size={24} className="text-orange-600" />, stat: "4.8★", title: "Top Rated Hosts", desc: "Thousands of 5-star stays across the world" },
                    ].map((item) => (
                        <div key={item.title} className="flex flex-col items-center text-center rounded-2xl bg-white p-6 border border-stone-100 shadow-[0_2px_12px_rgba(28,25,23,0.06)]">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 mb-4">
                                {item.icon}
                            </span>
                            <p className="text-2xl font-extrabold text-stone-900 mb-1">{item.stat}</p>
                            <p className="font-bold text-stone-900 mb-1">{item.title}</p>
                            <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA for non-managers */}
            {(!user || !user.venueManager) && (
                <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
                    <div className="rounded-3xl bg-stone-900 px-8 py-12 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400 mb-3">Are you a venue owner?</p>
                        <h2 className="text-2xl font-extrabold text-white mb-4 sm:text-3xl">List your property on Holidaze</h2>
                        <p className="text-stone-400 mb-6 max-w-md mx-auto text-sm">Reach thousands of travelers and start earning from your property today.</p>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors duration-200 cursor-pointer"
                        >
                            Become a host →
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}