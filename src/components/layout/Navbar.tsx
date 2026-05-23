import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setDropdownOpen(false);
            }

            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(target) &&
                hamburgerRef.current &&
                !hamburgerRef.current.contains(target)
            ) {
                setMobileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setDropdownOpen(false);
                setMobileOpen(false);
            }
        }

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    function closeMenus() {
        setDropdownOpen(false);
        setMobileOpen(false);
    }

    function handleLogout() {
        logout();
        closeMenus();
        navigate("/");
    }

    const dashboardPath = user?.venueManager ? "/manager" : "/dashboard";
    const dashboardLabel = user?.venueManager ? "My Venues" : "My Bookings";
    const roleLabel = user?.venueManager ? "Venue Manager" : "Customer";
    const avatarSrc = user?.avatar || "https://placehold.co/80x80/FFF7ED/EA580C?text=?";

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-stone-100 bg-white/90 shadow-[0_1px_8px_rgba(28,25,23,0.06)] backdrop-blur-md">
            <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10 lg:py-4">
                <Link
                    to="/"
                    onClick={closeMenus}
                    className="text-2xl font-extrabold tracking-tight text-orange-600 sm:text-3xl"
                    aria-label="Holidaze home"
                >
                    Holidaze
                </Link>

                {/* desktop navigation */}
                <div className="hidden items-center gap-6 md:flex">
                    <Link
                        to="/venues"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600"
                    >
                        Venues
                    </Link>

                    {!user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(234,88,12,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-[0_6px_16px_rgba(234,88,12,0.35)]"
                            >
                                Register
                            </Link>
                        </div>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen((open) => !open)}
                                className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-2 py-1.5 shadow-sm transition-all duration-200 hover:border-orange-200 hover:bg-orange-50/60"
                                aria-expanded={dropdownOpen}
                                aria-label="Open user menu"
                            >
                                <img
                                    src={avatarSrc}
                                    alt={`${user.name} avatar`}
                                    className="h-9 w-9 rounded-full border-2 border-orange-100 object-cover"
                                    onError={(event) => {
                                        event.currentTarget.src =
                                            "https://placehold.co/80x80/FFF7ED/EA580C?text=?";
                                    }}
                                />

                                <span className="max-w-32 truncate text-sm font-semibold text-stone-800">
                                    {user.name}
                                </span>

                                <ChevronDown
                                    size={16}
                                    className={`text-stone-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_16px_40px_rgba(28,25,23,0.14)]">
                                    <div className="border-b border-stone-100 bg-orange-50/70 px-4 py-3">
                                        <p className="truncate text-sm font-bold text-stone-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs font-medium text-stone-500">
                                            {roleLabel}
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        <Link
                                            to="/venues"
                                            onClick={closeMenus}
                                            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600"
                                        >
                                            Venues
                                        </Link>

                                        <Link
                                            to={dashboardPath}
                                            onClick={closeMenus}
                                            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600"
                                        >
                                            {dashboardLabel}
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-50"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* mobile hamburger */}
                <button
                    ref={hamburgerRef}
                    type="button"
                    onClick={() => setMobileOpen((open) => !open)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600 md:hidden"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={23} /> : <Menu size={23} />}
                </button>

                {/* mobile menu */}
                {mobileOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="absolute left-3 right-3 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_20px_50px_rgba(28,25,23,0.18)] md:hidden"
                    >
                        <div className="flex flex-col p-3">
                            <Link
                                to="/venues"
                                onClick={closeMenus}
                                className="rounded-xl px-4 py-3 text-base font-semibold text-stone-800 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600"
                            >
                                Venues
                            </Link>

                            {!user ? (
                                <div className="mt-2 grid gap-2 border-t border-stone-100 pt-3">
                                    <Link
                                        to="/login"
                                        onClick={closeMenus}
                                        className="rounded-xl px-4 py-3 text-center text-base font-semibold text-stone-800 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={closeMenus}
                                        className="rounded-xl bg-orange-600 px-4 py-3 text-center text-base font-bold text-white shadow-[0_4px_12px_rgba(234,88,12,0.25)] transition-colors duration-200 hover:bg-orange-700"
                                    >
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="my-3 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
                                        <Link
                                            to={dashboardPath}
                                            onClick={closeMenus}
                                            className="flex items-center gap-3"
                                        >
                                            <img
                                                src={avatarSrc}
                                                alt={`${user.name} avatar`}
                                                className="h-12 w-12 rounded-full border-2 border-orange-200 bg-white object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.src =
                                                        "https://placehold.co/80x80/FFF7ED/EA580C?text=?";
                                                }}
                                            />

                                            <div className="min-w-0">
                                                <p className="truncate text-base font-bold text-stone-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm font-medium text-stone-500">
                                                    {roleLabel}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>

                                    <Link
                                        to={dashboardPath}
                                        onClick={closeMenus}
                                        className="rounded-xl px-4 py-3 text-base font-semibold text-stone-800 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600"
                                    >
                                        {dashboardLabel}
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="mt-2 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-base font-bold text-red-600 transition-colors duration-200 hover:bg-red-50"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}