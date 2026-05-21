import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <nav className="flex justify-between items-center bg-white border-b px-10 py-4">
            <Link to="/" className="font-bold text-2xl text-orange-600">
                Holidaze
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/venues" className="text-gray-800 hover:text-orange-600">
                    Venues
                </Link>

                {!user ? (
                    <>
                        <Link to="/login" className="text-gray-800 hover:text-orange-600">
                            Login
                        </Link>
                        <Link to="/register" className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 cursor-pointer">
                            Register
                        </Link>
                    </>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <img
                                src={user.avatar || "https://placehold.co/40x40?text=?"}
                                alt="avatar"
                                className="w-9 h-9 rounded-full object-cover border"
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/40x40?text=?"; }}
                            />
                            <span className="text-sm text-gray-800">{user.name}</span>
                            <span className="text-xs text-gray-500">▾</span>
                        </button>

                        {open && (
                            <div className="absolute right-0 top-12 bg-white border rounded-xl shadow-lg w-48 py-2 z-50">
                                <p className="text-xs text-gray-400 px-4 py-1">
                                    {user.venueManager ? "Venue Manager" : "Customer"}
                                </p>
                                <hr className="my-1" />
                                {user.venueManager ? (
                                    <Link
                                        to="/manager"
                                        onClick={() => setOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        My Venues
                                    </Link>
                                ) : (
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        My Bookings
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-50 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}