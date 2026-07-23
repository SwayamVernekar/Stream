// ─────────────────────────────────────────────────────────
//  Navbar Component — Glassmorphism navigation bar
// ─────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import GoLiveModal from "./GoLiveModal";
import API from "../api/axios";

const Navbar = () => {
  const { user, token, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Profile dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Go Live modal state
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);
  const [isEndingStream, setIsEndingStream] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide navbar on landing page
  if (location.pathname === "/") {
    return null;
  }

  // Log out and redirect to landing
  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/");
  };

  const handleEndStream = async () => {
    try {
      setIsEndingStream(true);
      await API.post("/stream/stop", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local user state
      login(token, { ...user, isLive: false });
      // Redirect to home dashboard
      navigate("/home");
    } catch (err) {
      console.error("Failed to stop stream:", err);
    } finally {
      setIsEndingStream(false);
    }
  };

  // Avatar: first letter of username
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <>
    <nav
      className="sticky top-0 z-50 w-full px-6 py-3 flex items-center justify-between"
      style={{
        background: "rgba(22, 22, 31, 0.55)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow:
          "inset 0 0 0 1px rgba(170, 202, 255, 0.08), inset 0 0 16px 0 rgba(170, 202, 255, 0.04), 0 4px 24px 0 rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* ── Left: Logo + Name ──────────────────────────── */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="h-7 w-7 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={logo}
            alt="Terminal logo"
            className="h-full w-full object-cover"
            style={{ transform: "scale(2.8)" }}
          />
        </div>
        <span
          className="text-lg font-bold text-white tracking-tight"
          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        >
          Terminal
        </span>
      </Link>

      {/* ── Right: Nav items ───────────────────────────── */}
      <div className="flex items-center gap-2.5">
        {/* Home link */}
        <Link
          to="/home"
          className={`text-sm font-medium px-4 py-1.5 rounded-full
                     backdrop-blur-lg transition-all duration-200
                     ${location.pathname === "/home"
                       ? "text-white bg-white/10"
                       : "text-white/60 hover:text-white bg-[rgba(43,55,80,0.1)] hover:bg-white/10"
                     }`}
          style={{
            boxShadow:
              location.pathname === "/home"
                ? "inset 0 0 0 1px rgba(170, 202, 255, 0.25), inset 0 0 16px 0 rgba(170, 202, 255, 0.12), 0 1px 3px 0 rgba(0,0,0,0.50)"
                : "inset 0 0 0 1px rgba(170, 202, 255, 0.12), inset 0 0 16px 0 rgba(170, 202, 255, 0.05), 0 1px 3px 0 rgba(0,0,0,0.50)",
          }}
        >
          Home
        </Link>

        {user ? (
          <>
            {user.isLive ? (
              <button
                onClick={handleEndStream}
                disabled={isEndingStream}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20
                           text-red-400 border border-red-500/30 px-4 py-1.5 rounded-full text-sm font-semibold
                           transition-all duration-200"
              >
                {isEndingStream ? (
                  <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                )}
                End Stream
              </button>
            ) : (
              <button
                onClick={() => setIsGoLiveModalOpen(true)}
                className="flex items-center gap-2 bg-white hover:bg-gray-100
                           text-black px-4 py-1.5 rounded-full text-sm font-semibold
                           transition-all duration-200 hover:shadow-lg hover:shadow-white/15"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                Go Live
              </button>
            )}

            {/* Profile avatar + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center justify-center cursor-pointer
                           rounded-full hover:ring-2 hover:ring-white/20
                           transition-all duration-200"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center
                             bg-white text-black font-bold flex-shrink-0"
                  style={{
                    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                    fontSize: "0.85rem",
                  }}
                >
                  {avatarLetter}
                </div>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden
                             shadow-2xl shadow-black/50"
                  style={{
                    background: "rgba(22, 22, 31, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                  }}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300
                               hover:bg-white/5 hover:text-white
                               transition-colors duration-150"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Guest: Login + Sign Up — glass pill buttons */}
            <Link
              to="/login"
              className={`text-sm font-medium px-5 py-1.5 rounded-full
                         backdrop-blur-lg transition-all duration-200
                         ${location.pathname === "/login"
                           ? "text-white bg-white/10"
                           : "text-white/70 hover:text-white bg-[rgba(43,55,80,0.1)] hover:bg-white/10"
                         }`}
              style={{
                boxShadow:
                  location.pathname === "/login"
                    ? "inset 0 0 0 1px rgba(170, 202, 255, 0.25), inset 0 0 16px 0 rgba(170, 202, 255, 0.12), 0 1px 3px 0 rgba(0,0,0,0.50)"
                    : "inset 0 0 0 1px rgba(170, 202, 255, 0.12), inset 0 0 16px 0 rgba(170, 202, 255, 0.05), 0 1px 3px 0 rgba(0,0,0,0.50)",
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`text-sm font-semibold px-5 py-1.5 rounded-full
                         backdrop-blur-lg transition-all duration-200
                         ${location.pathname === "/register"
                           ? "text-white bg-white/15"
                           : "text-white bg-[rgba(43,55,80,0.15)] hover:bg-white/10"
                         }`}
              style={{
                boxShadow:
                  location.pathname === "/register"
                    ? "inset 0 0 0 1px rgba(170, 202, 255, 0.3), inset 0 0 16px 0 rgba(170, 202, 255, 0.15), 0 1px 3px 0 rgba(0,0,0,0.50)"
                    : "inset 0 0 0 1px rgba(170, 202, 255, 0.15), inset 0 0 16px 0 rgba(170, 202, 255, 0.08), 0 1px 3px 0 rgba(0,0,0,0.50), 0 4px 12px 0 rgba(0,0,0,0.45)",
              }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

    </nav>

    <GoLiveModal
      isOpen={isGoLiveModalOpen}
      onClose={() => setIsGoLiveModalOpen(false)}
    />
    </>
  );
};

export default Navbar;
