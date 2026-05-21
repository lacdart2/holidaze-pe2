import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function Login() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    /* const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); */
    const [email, setEmail] = useState("kader@stud.noroff.no");
    const [password, setPassword] = useState("Kader-123");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await login({ email, password });

            setUser({
                name: res.data.name,
                email: res.data.email,
                accessToken: res.data.accessToken,
                venueManager: res.data.venueManager,
            });

            toast.success("Welcome back!");
            navigate(res.data.venueManager ? "/manager" : "/dashboard");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Login failed";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white border rounded-xl p-8 w-full max-w-md">
                <h1 className="font-bold text-3xl text-gray-900 mb-1">Welcome Back</h1>
                <p className="text-gray-500 text-sm mb-6">Log in to your account</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="your@stud.noroff.no"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                            required
                        />
                    </div>

                    {/* password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500"
                            required
                        />
                    </div>

                    {/* submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-medium cursor-pointer transition-colors duration-200 "
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-orange-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}