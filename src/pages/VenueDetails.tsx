import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getVenueById } from "../api/venues";
import type { Venue } from "../api/venues";
import { createBooking } from "../api/bookings";
import { useAuthStore } from "../store/authStore";
import { Wifi, Car, Coffee, PawPrint, Star, Users, ShieldCheck, Building, CalendarCheck, MapPin, ChevronRight } from "lucide-react";
import BookingCalendar from "../components/venues/BookingCalendar";
import toast from "react-hot-toast";
import BookingConfirmModal from "../components/venues/BookingConfirmModal";
import { getProfile, getProfileVenues } from "../api/profiles";
import type { Profile } from "../api/profiles";
import HostVenuesModal from "../components/venues/HostVenuesModal";

export default function VenueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);
    const [guests, setGuests] = useState<number | "">(1);
    const [booking, setBooking] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [ownerProfile, setOwnerProfile] = useState<Profile | null>(null);
    const [showHostVenues, setShowHostVenues] = useState(false);
    const [hostVenues, setHostVenues] = useState<Venue[]>([]);
    const [activeImage, setActiveImage] = useState(0);
    const [showCheckinPicker, setShowCheckinPicker] = useState(false);
    const [showCheckoutPicker, setShowCheckoutPicker] = useState(false);

    useEffect(() => {
        async function fetchVenue() {
            try {
                const res = await getVenueById(id!);
                setVenue(res.data);
                if (res.data.owner?.name) {
                    try {
                        const profileRes = await getProfile(res.data.owner.name);
                        setOwnerProfile(profileRes.data);
                    } catch {
                        // silently fail
                    }
                }
            } catch {
                toast.error("Failed to load venue");
            } finally {
                setLoading(false);
            }
        }
        fetchVenue();
    }, [id]);

    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setShowCheckinPicker(false);
                setShowCheckoutPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function toNoonISO(date: Date): string {
        const d = new Date(date);
        d.setHours(12, 0, 0, 0);
        return d.toISOString();
    }

    async function handleShowHostVenues() {
        if (!ownerProfile) return;
        try {
            const res = await getProfileVenues(ownerProfile.name);
            setHostVenues(res.data);
            setShowHostVenues(true);
        } catch {
            toast.error("Could not load host venues");
        }
    }

    async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!user) {
            toast.error("Please log in to book");
            navigate("/login", { state: { from: `/venues/${id}` } });
            return;
        }
        if (!dateFrom || !dateTo) {
            toast.error("Please select check-in and check-out dates");
            return;
        }
        setShowModal(true);
    }

    async function confirmBooking() {
        setBooking(true);
        try {
            await createBooking({
                dateFrom: toNoonISO(dateFrom!),
                dateTo: toNoonISO(dateTo!),
                guests: guests === "" ? 1 : guests,
                venueId: id!,
            });
            setBookingConfirmed(true);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Booking failed");
            setShowModal(false);
        } finally {
            setBooking(false);
        }
    }

    if (loading) return <p className="text-center py-20">Loading...</p>;
    if (!venue) return <p className="text-center py-20">Venue not found.</p>;

    const images = venue.media?.length ? venue.media : [{ url: "https://placehold.co/1200x600?text=No+Image", alt: "No image" }];
    const location = [venue.location?.city, venue.location?.country].filter(Boolean).join(", ") || "Location not specified";


    return (
        <div className="bg-white min-h-screen pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
                    <Link to="/venues" className="hover:text-orange-500 transition-colors duration-200">Venues</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-600 line-clamp-1">{venue.name}</span>
                </div>

                <div className="mb-5">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                    <div className="flex items-center gap-4 flex-wrap text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Star size={14} className="text-orange-500 fill-orange-500" />
                            {venue.rating} rating
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Users size={14} />
                            Max {venue.maxGuests} guests
                        </span>
                        {location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-orange-500" /> {location}
                            </span>
                        )}
                    </div>
                </div>
                {images.length === 1 ? (
                    <div className="h-80 sm:h-96 rounded-2xl overflow-hidden mb-8">
                        <img
                            src={images[0].url}
                            alt={images[0].alt || venue.name}
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/1200x600?text=No+Image"; }}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 sm:h-96 rounded-2xl overflow-hidden mb-8">
                        <div className="col-span-2 row-span-2">
                            <img
                                src={images[activeImage]?.url}
                                alt={images[activeImage]?.alt || venue.name}
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400?text=No+Image"; }}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {images.slice(1, 5).map((img, i) => (
                            <div
                                key={i}
                                className="relative cursor-pointer overflow-hidden"
                                onClick={() => setActiveImage(i + 1)}
                            >
                                <img
                                    src={img.url}
                                    alt={img.alt || venue.name}
                                    onError={(e) => { e.currentTarget.src = "https://placehold.co/300x200?text=No+Image"; }}
                                    className={`w-full h-full object-cover transition-opacity duration-200 ${activeImage === i + 1 ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                                />
                                {i === 3 && images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">+{images.length - 5} photos</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {Array.from({ length: Math.max(0, 4 - (images.length - 1)) }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-gray-100" />
                        ))}
                    </div>
                )}
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1">
                        <p className="text-2xl font-bold text-orange-600 mb-4">
                            NOK {venue.price} <span className="text-base font-normal text-gray-400">/ night</span>
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-6">{venue.description}</p>
                        <div className="flex gap-2 flex-wrap mb-8">
                            {venue.meta?.wifi && (
                                <span className="flex items-center gap-1.5 text-sm bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-full font-medium">
                                    <Wifi size={13} /> Wifi
                                </span>
                            )}
                            {venue.meta?.parking && (
                                <span className="flex items-center gap-1.5 text-sm bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-full font-medium">
                                    <Car size={13} /> Parking
                                </span>
                            )}
                            {venue.meta?.breakfast && (
                                <span className="flex items-center gap-1.5 text-sm bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-full font-medium">
                                    <Coffee size={13} /> Breakfast
                                </span>
                            )}
                            {venue.meta?.pets && (
                                <span className="flex items-center gap-1.5 text-sm bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-full font-medium">
                                    <PawPrint size={13} /> Pets allowed
                                </span>
                            )}
                        </div>
                        {ownerProfile && (
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={ownerProfile.avatar?.url || "https://placehold.co/56x56?text=?"}
                                            alt={ownerProfile.name}
                                            onError={(e) => { e.currentTarget.src = "https://placehold.co/56x56?text=?"; }}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-orange-500"
                                        />
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Hosted by</p>
                                        <p className="font-semibold text-gray-900">{ownerProfile.name}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <ShieldCheck size={13} className="text-orange-500" />
                                            <span className="text-xs text-orange-500">Venue Manager</span>
                                        </div>
                                    </div>
                                </div>

                                {ownerProfile.bio && (
                                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{ownerProfile.bio}</p>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleShowHostVenues}
                                        className="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3 border border-orange-100 cursor-pointer hover:bg-orange-100 transition-colors duration-200 w-full"
                                    >
                                        <Building size={18} className="text-orange-500" />
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-900 text-lg leading-none">{ownerProfile._count.venues}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Venues</p>
                                        </div>
                                    </button>
                                    <div className="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3 border border-orange-100">
                                        <CalendarCheck size={18} className="text-orange-500" />
                                        <div>
                                            <p className="font-semibold text-gray-900 text-lg leading-none">{ownerProfile._count.bookings}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Bookings</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full lg:w-96">
                        <div className="border border-gray-200 rounded-2xl p-6 shadow-lg lg:sticky lg:top-24">
                            <div className="flex justify-between items-baseline mb-5">
                                <div>
                                    <span className="text-2xl font-bold text-orange-600">NOK {venue.price}</span>
                                    <span className="text-sm text-gray-400"> / night</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Star size={13} className="text-orange-500 fill-orange-500" />
                                    {venue.rating}
                                </div>
                            </div>

                            <form onSubmit={handleBooking} className="flex flex-col gap-4">
                                <div ref={calendarRef} className="flex flex-col gap-4">
                                    <div className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${showCheckinPicker || showCheckoutPicker ? "border-orange-300 shadow-orange-100 shadow-md" : "border-gray-200"}`}>
                                        <div className="grid grid-cols-2 border-b border-gray-200">
                                            <div
                                                className={`px-4 py-3 border-r border-gray-200 cursor-pointer transition-colors duration-200 ${showCheckinPicker ? "bg-orange-50" : "bg-white hover:bg-orange-50"}`}
                                                onClick={() => { setShowCheckinPicker(true); setShowCheckoutPicker(false); }}
                                            >
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Check-in</p>
                                                <p className="text-sm font-medium text-gray-800">{dateFrom ? dateFrom.toLocaleDateString("en-GB") : "Add date"}</p>
                                                {showCheckinPicker && <p className="text-xs text-orange-400 mt-0.5">Select below ↓</p>}
                                            </div>
                                            <div
                                                className={`px-4 py-3 cursor-pointer transition-colors duration-200 ${showCheckoutPicker ? "bg-orange-50" : "bg-white hover:bg-orange-50"}`}
                                                onClick={() => { setShowCheckoutPicker(true); setShowCheckinPicker(false); }}
                                            >
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Check-out</p>
                                                <p className="text-sm font-medium text-gray-800">{dateTo ? dateTo.toLocaleDateString("en-GB") : "Add date"}</p>
                                                {showCheckoutPicker && <p className="text-xs text-orange-400 mt-0.5">Select below ↓</p>}
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Guests</p>
                                                <p className="text-xs text-gray-400">Max {venue.maxGuests}</p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-white rounded-full px-1 py-1 border border-gray-200 shadow-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => setGuests(g => g === "" || g <= 1 ? 1 : (g as number) - 1)}
                                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors duration-200 text-lg font-light"
                                                >
                                                    −
                                                </button>
                                                <span className="min-w-[2rem] text-center text-sm font-semibold text-gray-900">{guests || 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setGuests(g => {
                                                        const current = g === "" ? 1 : (g as number);
                                                        return current < venue.maxGuests ? current + 1 : current;
                                                    })}
                                                    className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white hover:bg-orange-700 cursor-pointer transition-colors duration-200 text-lg font-light"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {(showCheckinPicker || showCheckoutPicker) && (
                                        <BookingCalendar
                                            bookings={venue.bookings ?? []}
                                            dateFrom={dateFrom}
                                            dateTo={dateTo}
                                            onChangeDateFrom={(date) => { setDateFrom(date); setShowCheckinPicker(false); setShowCheckoutPicker(true); }}
                                            onChangeDateTo={(date) => { setDateTo(date); setShowCheckoutPicker(false); }}
                                        />
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={booking}
                                    className="w-full bg-orange-600 text-white py-3.5 rounded-xl hover:bg-orange-700 transition-colors duration-200 cursor-pointer font-semibold text-sm disabled:opacity-50 shadow-md shadow-orange-200"
                                >
                                    {booking ? "Booking..." : "Book Now"}
                                </button>
                                <p className="text-center text-xs text-gray-400">You won't be charged yet</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && dateFrom && dateTo && (
                <BookingConfirmModal
                    venueName={venue.name}
                    venueImage={venue.media?.[0]?.url || "https://placehold.co/48x48?text=?"}
                    venueLocation={location}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    guests={guests === "" ? 1 : guests}
                    pricePerNight={venue.price}
                    confirmed={bookingConfirmed}
                    loading={booking}
                    userName={user?.name || ""}
                    onConfirm={confirmBooking}
                    onCancel={() => { setShowModal(false); setBookingConfirmed(false); }}
                    onGoToDashboard={() => navigate("/dashboard")}
                    onBackToVenue={() => { setShowModal(false); setBookingConfirmed(false); }}
                />
            )}

            {showHostVenues && (
                <HostVenuesModal
                    hostName={ownerProfile?.name || ""}
                    venues={hostVenues}
                    onClose={() => setShowHostVenues(false)}
                />
            )}
        </div>
    );
}