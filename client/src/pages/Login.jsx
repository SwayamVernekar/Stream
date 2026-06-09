// ─────────────────────────────────────────────────────────
//  Login Page — Authenticate existing user
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", { email, password });

      // Save token + user to context & localStorage
      login(data.token, data.user);

      // Redirect to home page
      navigate("/");
    } catch (err) {
      // Show server error message or a generic fallback
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: "#0a0a0f" }}
    >
      {/* Background gradient orb */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.07] pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
      />

      <div className="glass-strong rounded-2xl p-8 w-full max-w-md relative animate-fade-in">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Sign in to your account
        </p>

        {/* Error message */}
        {error && (
          <div
            className="bg-red-500/10 border border-red-500/20 text-red-400
                        px-4 py-3 rounded-xl mb-6 text-sm text-center animate-slide-up"
          >
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3
                         placeholder-gray-600 input-glow transition-all duration-200"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3
                         placeholder-gray-600 input-glow transition-all duration-200"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gradient text-white font-semibold py-3 rounded-xl
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Link to register */}
        <p className="text-gray-500 text-center mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
