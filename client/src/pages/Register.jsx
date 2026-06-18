// ─────────────────────────────────────────────────────────
//  Register Page — Create a new user account
// ─────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { CanvasRevealEffect } from "../components/CanvasRevealEffect";
import { motion } from "framer-motion";
import { HoverButton } from "@/components/ui/hover-button";
import googleLogo from "../assets/google-logo.png";

const GOOGLE_CLIENT_ID =
  "82172498205-a0gbguk5imae3plgcce1tn1evbe8u9ar.apps.googleusercontent.com";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/register", {
        username,
        email,
        password,
      });

      // Save token + user to context & localStorage
      login(data.token, data.user);

      // Redirect to home page
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-Up
  const handleGoogleSignUp = useCallback(() => {
    setError("");
    setGoogleLoading(true);

    try {
      /* global google */
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const { data } = await API.post("/auth/google", {
              credential: response.credential,
            });

            login(data.token, data.user);
            navigate("/home");
          } catch (err) {
            setError(
              err.response?.data?.message || "Google sign-up failed. Please try again."
            );
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      google.accounts.id.prompt((notification) => {
        if (
          notification.isNotDisplayed() ||
          notification.isSkippedMoment() ||
          notification.isDismissedMoment()
        ) {
          setGoogleLoading(false);
        }
      });
    } catch {
      setError("Google sign-up is not available. Please try again later.");
      setGoogleLoading(false);
    }
  }, [login, navigate]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#0a0a0f]">
      {/* WebGL Dot-Matrix Background */}
      <div className="absolute inset-0 z-0">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[[255, 255, 255]]}
          dotSize={6}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
      </div>

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
          Create Account
        </h1>
        <p className="text-neutral-400 text-center mb-8 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          Join the streaming community
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Register form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username field */}
          <div>
            <label className="block text-neutral-400 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="coolstreamer"
              required
              className="w-full bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/10 text-white rounded-xl px-4 py-3 placeholder-neutral-600 transition-all duration-200 outline-none"
            />
          </div>

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
              className="w-full bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/10 text-white rounded-xl px-4 py-3 placeholder-neutral-600 transition-all duration-200 outline-none"
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
              className="w-full bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/10 text-white rounded-xl px-4 py-3 placeholder-neutral-600 transition-all duration-200 outline-none"
            />
          </div>

          {/* Submit button */}
          <div className="mt-4">
            <HoverButton
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 font-semibold"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </span>
            </HoverButton>
          </div>
        </form>

        {/* ── Divider ──────────────────────────────── */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-neutral-500 text-xs font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* ── Google Sign-Up Button ────────────────── */}
        <HoverButton
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          className="w-full rounded-xl py-3 font-semibold"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {googleLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing up...
              </>
            ) : (
              <>
                <img src={googleLogo} alt="Google" className="w-5 h-5" />
                Google Sign Up
              </>
            )}
          </span>
        </HoverButton>

        {/* Link to login */}
        <p className="text-neutral-500 text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Register;
