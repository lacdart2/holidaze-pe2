import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Edit,
    Hotel,
    ImageUp,
    Loader2,
    Plus,
    Trash2,
    UserRound,
    Users,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../components/common/ConfirmModal";
import { getProfileVenues, updateAvatar } from "../api/profiles";
import { deleteVenue } from "../api/venues";
import type { Venue } from "../api/venues";
import { useAuthStore } from "../store/authStore";

interface VenueBooking {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    customer?: {
        name: string;
        email?: string;
    };
}

interface VenueWithBookings extends Venue {
    bookings?: VenueBooking[];
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function ManagerDashboard() {
    const { user, setUser } = useAuthStore();
    const navigate = useNavigate();

    const [venues, setVenues] = useState<VenueWithBookings[]>([]);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [showAvatarForm, setShowAvatarForm] = useState(false);
    const [savingAvatar, setSavingAvatar] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        async function fetchVenues() {
            try {
                const res = await getProfileVenues(user!.name);
                setVenues(res.data as VenueWithBookings[]);
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Something went wrong";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }

        fetchVenues();
    }, [user, navigate]);

    const upcomingBookings = useMemo(() => {
        return venues.flatMap((venue) =>
            (venue.bookings || []).map((booking) => ({
                ...booking,
                venueId: venue.id,
                venueName: venue.name,
            }))
        );
    }, [venues]);

    async function handleAvatarUpdate(e: React.FormEvent) {
        e.preventDefault();

        if (!avatarUrl.trim()) {
            toast.error("Please add an image URL");
            return;
        }

        try {
            setSavingAvatar(true);
            await updateAvatar(user!.name, avatarUrl.trim());
            setUser({ ...user!, avatar: avatarUrl.trim() });
            toast.success("Avatar updated!");
            setShowAvatarForm(false);
            setAvatarUrl("");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        } finally {
            setSavingAvatar(false);
        }
    }

    async function handleDelete() {
        if (!deleteId) return;

        try {
            await deleteVenue(deleteId);
            setVenues((current) => current.filter((venue) => venue.id !== deleteId));
            toast.success("Venue deleted!");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        } finally {
            setDeleteId(null);
        }
    }

    if (!user) return null;

    const avatarSrc =
        user.avatar || "https://placehold.co/160x160/FFF7ED/EA580C?text=?";

    return (
        <main className="min-h-screen bg-[#FAFAF9] px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-6xl">
                <section className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(28,25,23,0.08)]">
                    <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50 px-5 py-6 sm:px-8 sm:py-8">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4 sm:gap-6">
                                <img
                                    src={avatarSrc}
                                    alt={`${user.name} avatar`}
                                    className="h-20 w-20 rounded-full border-4 border-orange-100 bg-white object-cover shadow-[0_4px_16px_rgba(234,88,12,0.16)] sm:h-24 sm:w-24"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://placehold.co/160x160/FFF7ED/EA580C?text=?";
                                    }}
                                />

                                <div className="min-w-0">
                                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                                        <UserRound size={13} />
                                        Venue Manager
                                    </div>

                                    <h1 className="truncate text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
                                        {user.name}
                                    </h1>

                                    <p className="mt-1 truncate text-sm font-medium text-stone-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setShowAvatarForm((open) => !open)}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-stone-800 shadow-[0_4px_14px_rgba(28,25,23,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-50 cursor-pointer"
                                >
                                    <ImageUp size={17} />
                                    Update avatar
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/manager/create")}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(234,88,12,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700 cursor-pointer"
                                >
                                    <Plus size={18} />
                                    Add Venue
                                </button>
                            </div>
                        </div>
                    </div>

                    {showAvatarForm && (
                        <form
                            onSubmit={handleAvatarUpdate}
                            className="border-t border-stone-100 px-5 py-5 sm:px-8"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    type="url"
                                    placeholder="Paste your new avatar image URL"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={savingAvatar}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(28,25,23,0.18)] transition-all duration-200 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {savingAvatar && <Loader2 size={16} className="animate-spin" />}
                                    Save
                                </button>
                            </div>
                        </form>
                    )}
                </section>

                <section className="mt-8">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
                                Hosting
                            </p>
                            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900">
                                My Venues
                            </h2>
                        </div>

                        <p className="text-sm font-medium text-stone-500">
                            {venues.length} venue{venues.length === 1 ? "" : "s"}
                        </p>
                    </div>

                    {loading && (
                        <div className="rounded-3xl bg-white p-8 text-center shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
                            <Loader2 className="mx-auto h-7 w-7 animate-spin text-orange-600" />
                            <p className="mt-3 text-sm font-medium text-stone-500">
                                Loading your venues...
                            </p>
                        </div>
                    )}

                    {!loading && venues.length === 0 && (
                        <div className="rounded-3xl bg-white p-8 text-center shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                                <Hotel size={26} />
                            </div>

                            <h3 className="mt-4 text-lg font-extrabold text-stone-900">
                                No venues yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                                Add your first venue and start receiving bookings.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/manager/create")}
                                className="mt-5 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(234,88,12,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700"
                            >
                                Add your first venue
                            </button>
                        </div>
                    )}

                    {!loading && venues.length > 0 && (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {venues.map((venue) => {
                                const image =
                                    venue.media?.[0]?.url ||
                                    "https://placehold.co/600x400/FFF7ED/EA580C?text=Holidaze";

                                return (
                                    <article
                                        key={venue.id}
                                        className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_18px_rgba(28,25,23,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(28,25,23,0.12)]"
                                    >
                                        <img
                                            src={image}
                                            alt={venue.name}
                                            className="h-48 w-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://placehold.co/600x400/FFF7ED/EA580C?text=Holidaze";
                                            }}
                                        />

                                        <div className="p-5">
                                            <h3 className="line-clamp-1 text-lg font-extrabold text-stone-900">
                                                {venue.name}
                                            </h3>

                                            <div className="mt-3 flex flex-wrap gap-2 text-sm font-medium text-stone-500">
                                                <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
                                                    NOK {venue.price} / night
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-stone-600">
                                                    <Users size={14} />
                                                    {venue.maxGuests}
                                                </span>
                                            </div>

                                            <div className="mt-5 grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/manager/edit/${venue.id}`)}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-stone-800 cursor-pointer"
                                                >
                                                    <Edit size={15} />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteId(venue.id)}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-colors duration-200 hover:bg-red-100 cursor-pointer"
                                                >
                                                    <Trash2 size={15} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="mt-10">
                    <div className="mb-5">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
                            Bookings
                        </p>
                        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900">
                            Upcoming Bookings
                        </h2>
                    </div>

                    {!loading && upcomingBookings.length === 0 && (
                        <div className="rounded-3xl bg-white p-6 text-sm font-medium text-stone-500 shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
                            No upcoming bookings yet.
                        </div>
                    )}

                    {!loading && upcomingBookings.length > 0 && (
                        <div className="grid gap-3">
                            {upcomingBookings.map((booking) => (
                                <button
                                    key={booking.id}
                                    type="button"
                                    onClick={() => navigate(`/venues/${booking.venueId}`)}
                                    className="grid gap-3 rounded-2xl bg-white p-4 text-left shadow-[0_4px_18px_rgba(28,25,23,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(28,25,23,0.12)] sm:grid-cols-[1fr_auto] cursor-pointer"
                                >
                                    <div>
                                        <h3 className="font-bold text-stone-900">
                                            {booking.venueName}
                                        </h3>
                                        <p className="mt-1 text-sm font-medium text-stone-500">
                                            Guest: {booking.customer?.name || "Unknown customer"}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2 text-sm font-medium text-stone-500 sm:items-end">
                                        <span className="inline-flex items-center gap-2">
                                            <CalendarDays size={16} className="text-orange-600" />
                                            {formatDate(booking.dateFrom)} → {formatDate(booking.dateTo)}
                                        </span>

                                        <span className="inline-flex items-center gap-2">
                                            <Users size={16} className="text-orange-600" />
                                            {booking.guests} guest{booking.guests === 1 ? "" : "s"}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {deleteId && (
                <ConfirmModal
                    message="Are you sure you want to delete this venue?"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </main>
    );
}