// ─────────────────────────────────────────────────────────
//  Navbar Component — Auth-aware navigation bar
// ─────────────────────────────────────────────────────────

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Log out and redirect to home
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      {/* Brand / Logo */}
      <Link
        to="/"
        className="text-xl font-bold text-purple-400 hover:text-purple-300 transition"
      >
        🎥 Stream
      </Link>

      {/* Right-side navigation */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-300 hover:text-white transition">
          Home
        </Link>

        {user ? (
          <>
            {/* Logged-in user info */}
            <span className="text-gray-400 text-sm">
              👤 {user.username}
            </span>

            {/* Go Live button */}
            <Link
              to="/go-live"
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
            >
              🔴 Go Live
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-md text-sm transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Guest links */}
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
