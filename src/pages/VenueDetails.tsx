import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVenueById } from "../api/venues";
import type { Venue } from "../api/venues";
import { createBooking } from "../api/bookings";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function VenueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [guests, setGuests] = useState(1);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        async function fetchVenue() {
            try {
                const res = await getVenueById(id!);
                setVenue(res.data);
            } catch (err) {
                toast.error("Failed to load venue");
            } finally {
                setLoading(false);
            }
        }
        fetchVenue();
    }, [id]);

    async function handleBooking(e: React.FormEvent) {
        e.preventDefault();

        // redirect to login if not logged in
        if (!user) {
            toast.error("Please log in to book");
            navigate("/login");
            return;
        }

        setBooking(true);
        try {
            await createBooking({
                dateFrom,
                dateTo,
                guests,
                venueId: id!,
            });
            toast.success("Booking confirmed!");
            navigate("/dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Booking failed";
            toast.error(message);
        } finally {
            setBooking(false);
        }
    }

    if (loading) return <p className="text-center py-20">Loading...</p>;
    if (!venue) return <p className="text-center py-20">Venue not found.</p>;

    const image = venue.media?.[0]?.url || "https://placehold.co/1200x400?text=No+Image";

    return (
        <div>
            <img
                src={image}
                alt={venue.name}
                className="w-full h-80 object-cover"
            />
            <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
                <div className="flex-1">
                    <h1 className="font-bold text-3xl text-gray-900 mb-2">{venue.name}</h1>
                    <p className="text-gray-500 text-sm mb-1">
                        {venue.location?.city}, {venue.location?.country}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                        ⭐ {venue.rating} · Max guests: {venue.maxGuests}
                    </p>
                    <p className="font-bold text-orange-600 text-xl mb-6">
                        ${venue.price} / night
                    </p>
                    <p className="text-gray-700 leading-relaxed">{venue.description}</p>

                    <div className="flex gap-4 mt-6 flex-wrap">
                        {venue.meta?.wifi && <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">📶 Wifi</span>}
                        {venue.meta?.parking && <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">🚗 Parking</span>}
                        {venue.meta?.breakfast && <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">🍳 Breakfast</span>}
                        {venue.meta?.pets && <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">🐾 Pets</span>}
                    </div>
                </div>
                {/* booking form */}
                <div className="w-full lg:w-80">
                    <div className="border rounded-xl p-6">
                        <h2 className="font-semibold text-xl text-gray-900 mb-4">Select Dates</h2>

                        <form onSubmit={handleBooking} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-700">Check-in</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-700">Check-out</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-700">Guests</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={venue.maxGuests}
                                    value={guests}
                                    onChange={(e) => setGuests(Number(e.target.value))}
                                    className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={booking}
                                className="flex justify-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 cursor-pointer font-medium"
                            >
                                {booking ? "Booking..." : "Book Now"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}