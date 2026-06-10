// ─────────────────────────────────────────────────────────
//  Login Page — Authenticate existing user
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import FloatingPaths from "../components/FloatingPaths";
import { motion } from "framer-motion";

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
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#0a0a0f]">
      {/* Background Animated Paths */}
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />

      {/* Subtle radial glow behind the form */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
      />

      <motion.div 
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Heading */}
        <h1 
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 text-center mb-2 tracking-tight"
          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        >
          Welcome Back
        </h1>
        <p className="text-neutral-400 text-center mb-8 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          Sign in to your account
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-neutral-400 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 text-white rounded-xl px-4 py-3 placeholder-neutral-600 transition-all duration-200 outline-none"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-neutral-400 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 text-white rounded-xl px-4 py-3 placeholder-neutral-600 transition-all duration-200 outline-none"
            />
          </div>

          {/* Submit button with animated border */}
          <div className="group relative p-px rounded-xl overflow-hidden transition-shadow duration-300 w-full mt-4">
            <div className="absolute inset-[-1000%] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#a855f7_100%)] transition-opacity duration-500" />
            <button
              type="submit"
              disabled={loading}
              className="relative w-full rounded-[0.7rem] bg-[#0a0a0f]/80 backdrop-blur-md text-white font-semibold py-3 transition-all duration-300 hover:bg-[#0a0a0f]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Link to register */}
        <p className="text-neutral-500 text-center mt-6 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Login;
