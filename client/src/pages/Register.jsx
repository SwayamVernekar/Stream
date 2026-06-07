// ─────────────────────────────────────────────────────────
//  Register Page — Create a new user account
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
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
      const { data } = await API.post("/auth/register", {
        username,
        email,
        password,
      });

      // Save token + user to context & localStorage
      login(data.token, data.user);

      // Redirect to home page
      navigate("/");
    } catch (err) {
      // Show server error message or a generic fallback
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Join the streaming community
        </p>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Register form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="coolstreamer"
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3
                         placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1
                         focus:ring-purple-500 transition"
            />
          </div>

          {/* Email field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3
                         placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1
                         focus:ring-purple-500 transition"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3
                         placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1
                         focus:ring-purple-500 transition"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed
                       text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Link to login */}
        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
