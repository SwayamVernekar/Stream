// ─────────────────────────────────────────────────────────
//  Navbar Component — Frosted glass navigation bar
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

  // Avatar: first letter of username
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <nav className="sticky top-0 z-50 glass-strong px-6 py-3.5 flex items-center justify-between">
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
          }}
        >
          ▶
        </div>
        <span className="text-xl font-bold gradient-text tracking-tight">
          Stream
        </span>
      </Link>

      {/* Right-side navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-gray-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg
                     hover:bg-white/5 transition-all duration-200"
        >
          Home
        </Link>

        {user ? (
          <>
            {/* User avatar + name */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                }}
              >
                {avatarLetter}
              </div>
              <span className="text-gray-300 text-sm font-medium">
                {user.username}
              </span>
            </div>

            {/* Go Live button */}
            <Link
              to="/go-live"
              className="flex items-center gap-2 bg-red-600/90 hover:bg-red-500 text-white
                         px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                         hover:shadow-lg hover:shadow-red-500/20"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              Go Live
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg
                         hover:bg-white/5 border border-transparent hover:border-white/10
                         transition-all duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Guest links */}
            <Link
              to="/login"
              className="text-gray-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg
                         hover:bg-white/5 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn-gradient text-white px-5 py-2 rounded-lg text-sm font-semibold"
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
