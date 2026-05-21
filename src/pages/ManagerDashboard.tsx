import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getProfileVenues, updateAvatar } from "../api/profiles";
import { deleteVenue } from "../api/venues";
import type { Venue } from "../api/venues";
import toast from "react-hot-toast";

interface VenueWithBookings extends Venue {
    bookings?: {
        id: string;
        dateFrom: string;
        dateTo: string;
        guests: number;
    }[];
}

export default function ManagerDashboard() {
    const { user, setUser } = useAuthStore();
    const navigate = useNavigate();

    const [venues, setVenues] = useState<VenueWithBookings[]>([]);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [showAvatarForm, setShowAvatarForm] = useState(false);

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
                const message = error instanceof Error ? error.message : "Something went wrong";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }
        fetchVenues();
    }, [user, navigate]);

    async function handleAvatarUpdate(e: React.FormEvent) {
        e.preventDefault();
        try {
            await updateAvatar(user!.name, avatarUrl);
            setUser({ ...user!, avatar: avatarUrl });
            toast.success("Avatar updated!");
            setShowAvatarForm(false);
            setAvatarUrl("");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this venue?")) return;
        try {
            await deleteVenue(id);
            setVenues(venues.filter((v) => v.id !== id));
            toast.success("Venue deleted!");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        }
    }

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex items-center gap-6 mb-10">
                <img
                    src={user.avatar || "https://placehold.co/80x80?text=?"}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                    <h1 className="font-bold text-2xl text-gray-900">{user.name}</h1>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <button
                        onClick={() => setShowAvatarForm(!showAvatarForm)}
                        className="text-orange-600 text-sm hover:underline cursor-pointer mt-1"
                    >
                        Update avatar
                    </button>
                </div>
                <button
                    onClick={() => navigate("/manager/create")}
                    className="flex items-center ml-auto bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 cursor-pointer"
                >
                    + Add Venue
                </button>
            </div>

            {showAvatarForm && (
                <form onSubmit={handleAvatarUpdate} className="flex gap-3 mb-8">
                    <input
                        type="url"
                        placeholder="Paste image URL"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="flex-1 border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                        required
                    />
                    <button
                        type="submit"
                        className="flex items-center bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 cursor-pointer"
                    >
                        Save
                    </button>
                </form>
            )}

            <h2 className="font-bold text-xl text-gray-900 mb-4">My Venues</h2>

            {loading && <p className="text-gray-500">Loading venues...</p>}

            {!loading && venues.length === 0 && (
                <p className="text-gray-500">No venues yet. Add your first venue!</p>
            )}

            {!loading && venues.length > 0 && (
                <div className="flex flex-col gap-6">
                    {venues.map((venue) => (
                        <div key={venue.id} className="border rounded-xl p-4">
                            <div className="flex gap-4 items-start">
                                <img
                                    src={venue.media?.[0]?.url || "https://placehold.co/80x80?text=?"}
                                    alt={venue.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                                    <p className="text-gray-500 text-sm">${venue.price} / night</p>
                                    <p className="text-gray-500 text-sm">Max guests: {venue.maxGuests}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/manager/edit/${venue.id}`)}
                                        className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(venue.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {venue.bookings && venue.bookings.length > 0 && (
                                <div className="mt-4 border-t pt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Upcoming bookings</p>
                                    <div className="flex flex-col gap-2">
                                        {venue.bookings.map((b) => (
                                            <p key={b.id} className="text-sm text-gray-500">
                                                {new Date(b.dateFrom).toLocaleDateString()} →{" "}
                                                {new Date(b.dateTo).toLocaleDateString()} · {b.guests} guests
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}