import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginApi } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("All fields are required");
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      setAuth(data.user, data.token);
      navigate("/projects");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-md shadow-sm">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Sign in to your TaskFlow account
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
