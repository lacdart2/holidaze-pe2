import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CalendarDays,
    Hotel,
    ImageUp,
    Loader2,
    UserRound,
    Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { getProfileBookings, updateAvatar } from "../api/profiles";
import { useAuthStore } from "../store/authStore";

interface Booking {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    venue?: {
        id: string;
        name: string;
        media: { url: string; alt?: string }[];
    };
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function CustomerDashboard() {
    const { user, setUser } = useAuthStore();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [showAvatarForm, setShowAvatarForm] = useState(false);
    const [savingAvatar, setSavingAvatar] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        async function fetchBookings() {
            try {
                const res = await getProfileBookings(user!.name);
                setBookings(res.data);
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Something went wrong";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }

        fetchBookings();
    }, [user, navigate]);

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

    if (!user) return null;

    const avatarSrc =
        user.avatar || "https://placehold.co/160x160/FFF7ED/EA580C?text=?";

    return (
        <main className="min-h-screen bg-[#FAFAF9] px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-5xl">
                {/* profil header */}
                <section className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(28,25,23,0.08)]">
                    <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50 px-5 py-6 sm:px-8 sm:py-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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
                                        Customer
                                    </div>

                                    <h1 className="truncate text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
                                        {user.name}
                                    </h1>

                                    <p className="mt-1 truncate text-sm font-medium text-stone-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAvatarForm((open) => !open)}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(234,88,12,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700 sm:w-auto"
                            >
                                <ImageUp size={17} />
                                Update avatar
                            </button>
                        </div>
                    </div>

                    {showAvatarForm && (
                        <form
                            onSubmit={handleAvatarUpdate}
                            className="border-t border-stone-100 px-5 py-5 sm:px-8"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <label className="sr-only" htmlFor="avatarUrl">
                                    Avatar image URL
                                </label>

                                <input
                                    id="avatarUrl"
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
                                    {savingAvatar && (
                                        <Loader2 size={16} className="animate-spin" />
                                    )}
                                    Save
                                </button>
                            </div>
                        </form>
                    )}
                </section>

                {/* bookings section */}
                <section className="mt-8">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
                                Trips
                            </p>
                            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900">
                                My Bookings
                            </h2>
                        </div>

                        <p className="text-sm font-medium text-stone-500">
                            {bookings.length} upcoming booking
                            {bookings.length === 1 ? "" : "s"}
                        </p>
                    </div>

                    {loading && (
                        <div className="rounded-3xl bg-white p-8 text-center shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
                            <Loader2 className="mx-auto h-7 w-7 animate-spin text-orange-600" />
                            <p className="mt-3 text-sm font-medium text-stone-500">
                                Loading your bookings...
                            </p>
                        </div>
                    )}

                    {!loading && bookings.length === 0 && (
                        <div className="rounded-3xl bg-white p-8 text-center shadow-[0_6px_24px_rgba(28,25,23,0.08)]">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                                <Hotel size={26} />
                            </div>

                            <h3 className="mt-4 text-lg font-extrabold text-stone-900">
                                No upcoming bookings yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                                Start exploring venues and book your next stay.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/venues")}
                                className="mt-5 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(234,88,12,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700"
                            >
                                Browse venues
                            </button>
                        </div>
                    )}

                    {!loading && bookings.length > 0 && (
                        <div className="grid gap-4">
                            {bookings.map((booking) => {
                                const venueImage =
                                    booking.venue?.media?.[0]?.url ||
                                    "https://placehold.co/500x350/FFF7ED/EA580C?text=Holidaze";

                                return (
                                    <button
                                        key={booking.id}
                                        type="button"
                                        onClick={() =>
                                            booking.venue?.id &&
                                            navigate(`/venues/${booking.venue.id}`)
                                        }
                                        className="group grid w-full gap-4 rounded-3xl bg-white p-4 text-left shadow-[0_4px_18px_rgba(28,25,23,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(28,25,23,0.12)] sm:grid-cols-[160px_1fr_auto] sm:items-center cursor-pointer"
                                    >
                                        <img
                                            src={venueImage}
                                            alt={booking.venue?.name || "Venue image"}
                                            className="h-44 w-full rounded-2xl object-cover sm:h-28"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://placehold.co/500x350/FFF7ED/EA580C?text=Holidaze";
                                            }}
                                        />

                                        <div className="min-w-0">
                                            <h3 className="truncate text-lg font-extrabold text-stone-900">
                                                {booking.venue?.name || "Unknown venue"}
                                            </h3>

                                            <div className="mt-3 flex flex-col gap-2 text-sm font-medium text-stone-500 sm:flex-row sm:flex-wrap sm:items-center">
                                                <span className="inline-flex items-center gap-2">
                                                    <CalendarDays
                                                        size={16}
                                                        className="text-orange-600"
                                                    />
                                                    {formatDate(booking.dateFrom)} →{" "}
                                                    {formatDate(booking.dateTo)}
                                                </span>

                                                <span className="hidden h-1 w-1 rounded-full bg-stone-300 sm:block" />

                                                <span className="inline-flex items-center gap-2">
                                                    <Users
                                                        size={16}
                                                        className="text-orange-600"
                                                    />
                                                    {booking.guests} guest
                                                    {booking.guests === 1 ? "" : "s"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 sm:bg-transparent sm:px-0 sm:py-0">
                                            View venue
                                            <ArrowRight
                                                size={18}
                                                className="transition-transform duration-200 group-hover:translate-x-1"
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}