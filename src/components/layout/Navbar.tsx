import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <nav className="flex justify-between items-center bg-white border-b px-10 py-4">
            {/* logo */}
            <Link to="/" className="font-bold text-2xl text-orange-600">
                Holidaze
            </Link>

            {/* nav links */}
            <div className="flex items-center gap-6">
                <Link to="/venues" className="text-gray-800 hover:text-orange-600">
                    Venues
                </Link>

                {!user ? (
                    <>
                        <Link to="/login" className="text-gray-800 hover:text-orange-600">
                            Login
                        </Link>
                        <Link to="/register" className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        {user.venueManager ? (
                            <Link to="/manager" className="text-gray-800 hover:text-orange-600">
                                My Venues
                            </Link>
                        ) : (
                            <Link to="/dashboard" className="text-gray-800 hover:text-orange-600">
                                My Bookings
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}