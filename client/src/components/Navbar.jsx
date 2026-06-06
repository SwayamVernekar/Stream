// ─────────────────────────────────────────────────────────
//  Navbar Component
// ─────────────────────────────────────────────────────────

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      {/* Logo / Brand */}
      <Link to="/" className="text-xl font-bold text-purple-400 hover:text-purple-300">
        🎥 Stream
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:text-purple-300 transition">
          Home
        </Link>

        {user ? (
          <>
            <span className="text-gray-400">Hi, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded text-sm transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-purple-300 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-purple-600 hover:bg-purple-500 px-4 py-1.5 rounded text-sm transition"
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
