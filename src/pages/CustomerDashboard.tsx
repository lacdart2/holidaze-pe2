import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getProfileBookings, updateAvatar } from "../api/profiles";
import toast from "react-hot-toast";

interface Booking {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    venue?: {
        name: string;
        media: { url: string; alt: string }[];
    };
}

export default function CustomerDashboard() {
    const { user, setUser } = useAuthStore();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [showAvatarForm, setShowAvatarForm] = useState(false);

    // redirect if not logged in
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
                const message = error instanceof Error ? error.message : "Something went wrong";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
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

            <h2 className="font-bold text-xl text-gray-900 mb-4">My Bookings</h2>

            {loading && <p className="text-gray-500">Loading bookings...</p>}

            {!loading && bookings.length === 0 && (
                <p className="text-gray-500">No upcoming bookings.</p>
            )}

            {!loading && bookings.length > 0 && (
                <div className="flex flex-col gap-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="flex gap-4 border rounded-xl p-4">
                            <img
                                src={booking.venue?.media?.[0]?.url || "https://placehold.co/80x80?text=?"}
                                alt={booking.venue?.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900">{booking.venue?.name}</h3>
                                <p className="text-gray-500 text-sm">
                                    {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                                    {new Date(booking.dateTo).toLocaleDateString()}
                                </p>
                                <p className="text-gray-500 text-sm">Guests: {booking.guests}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}