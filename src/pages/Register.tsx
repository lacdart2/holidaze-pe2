/* import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function Register() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isManager, setIsManager] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await register({
                name,
                email,
                password,
                venueManager: isManager,
            });

            // save user and redirect
            setUser({
                name: res.data.name,
                email: res.data.email,
                accessToken: res.data.accessToken,
                venueManager: res.data.venueManager,
            });

            toast.success("Account created!");
            navigate(isManager ? "/manager" : "/dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Registration failed";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white border rounded-xl p-8 w-full max-w-md">
                <h1 className="font-bold text-3xl text-gray-900 mb-1">Create Account</h1>
                <p className="text-gray-500 text-sm mb-6">Join Holidaze today</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Full name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                            required
                        />
                        <p className="text-xs text-gray-400">No spaces or special characters</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Email (stud.noroff.no)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                            required
                        />
                    </div>
                    <div>
                        <p className="text-sm text-gray-700 mb-2">Register as:</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsManager(false)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-colors duration-200 ${!isManager
                                    ? "bg-orange-600 text-white border-orange-600"
                                    : "bg-white text-gray-800 border-gray-300"
                                    }`}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsManager(true)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-colors duration-200 ${isManager
                                    ? "bg-orange-600 text-white border-orange-600"
                                    : "bg-white text-gray-800 border-gray-300"
                                    }`}
                            >
                                Venue Manager
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-medium cursor-pointer transition-colors duration-200"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4 text-center cursor-pointer transition-colors duration-200">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
} */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { registerSchema } from "../utils/validation";
import toast from "react-hot-toast";

export default function Register() {
    const navigate = useNavigate();
    const setUser = useAuthStore((s) => s.setUser);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isManager, setIsManager] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});

        const result = registerSchema.safeParse({ name, email, password, confirmPassword });
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await register({ name, email, password, venueManager: isManager });
            setUser({
                name: res.data.name,
                email: res.data.email,
                accessToken: res.data.accessToken,
                venueManager: res.data.venueManager,
            });
            toast.success("Account created!");
            navigate(isManager ? "/manager" : "/dashboard");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white border rounded-xl p-8 w-full max-w-md">
                <h1 className="font-bold text-3xl text-gray-900 mb-1">Create Account</h1>
                <p className="text-gray-500 text-sm mb-6">Join Holidaze today</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Username</label>
                        <input
                            type="text"
                            placeholder="e.g. john_doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="you@stud.noroff.no"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Min. 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Repeat your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                        />
                        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>

                    <div>
                        <p className="text-sm text-gray-700 mb-2">Register as:</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsManager(false)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-colors duration-200 ${!isManager ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-800 border-gray-300"
                                    }`}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsManager(true)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-colors duration-200 ${isManager ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-800 border-gray-300"
                                    }`}
                            >
                                Venue Manager
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-medium cursor-pointer transition-colors duration-200"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}