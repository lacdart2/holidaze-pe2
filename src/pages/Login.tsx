import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { loginSchema } from "../utils/validation";
import toast from "react-hot-toast";

export default function Login() {
    const navigate = useNavigate();
    const setUser = useAuthStore((s) => s.setUser);

    /*    const [email, setEmail] = useState("");
       const [password, setPassword] = useState(""); */
    const [email, setEmail] = useState("kader@stud.noroff.no");
    const [password, setPassword] = useState("Kader-123");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const location = useLocation();
    const from = (location.state as { from?: string })?.from || null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});

        const result = loginSchema.safeParse({ email, password });
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
            const res = await login({ email, password });
            setUser({
                name: res.data.name,
                email: res.data.email,
                accessToken: res.data.accessToken,
                venueManager: res.data.venueManager,
            });
            toast.success("Welcome back!");
            navigate(from ?? (res.data.venueManager ? "/manager" : "/dashboard"));
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-orange-50 to-white">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-[0_8px_40px_rgba(28,25,23,0.10)]">
                <h1 className="font-bold text-3xl text-gray-900 mb-1">Welcome Back</h1>
                <p className="text-gray-500 text-sm mb-6">Log in to your account</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border rounded-lg px-4 py-3 pr-10 text-sm outline-none focus:border-orange-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-medium cursor-pointer transition-colors duration-200"
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-orange-600 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}