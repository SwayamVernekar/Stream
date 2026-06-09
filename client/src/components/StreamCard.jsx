// ─────────────────────────────────────────────────────────
//  Stream Card — Glassmorphism live stream preview card
// ─────────────────────────────────────────────────────────

import { useNavigate } from "react-router-dom";

// Gradient palette for thumbnail banners — cycles per card
const GRADIENTS = [
  "linear-gradient(135deg, #4c1d95, #1e1b4b, #312e81)",
  "linear-gradient(135deg, #581c87, #1e1b4b, #1e3a5f)",
  "linear-gradient(135deg, #3b0764, #1e1b4b, #164e63)",
  "linear-gradient(135deg, #4a1d96, #1a1a2e, #0f3460)",
  "linear-gradient(135deg, #5b21b6, #1e1b4b, #1e293b)",
  "linear-gradient(135deg, #6d28d9, #1a1a2e, #1e3a5f)",
];

const StreamCard = ({ stream, index = 0 }) => {
  const navigate = useNavigate();

  // Extract streamer username from populated userId
  const username = stream.userId?.username || "Unknown";
  const avatarLetter = username.charAt(0).toUpperCase();
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <div
      onClick={() => navigate(`/stream/${stream.streamKey}`)}
      className="glass rounded-2xl overflow-hidden cursor-pointer
                 transform hover:-translate-y-1.5
                 transition-all duration-300 group animate-fade-in"
      style={{
        "--hover-glow": "0 8px 40px rgba(124, 58, 237, 0.15)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 8px 40px rgba(124, 58, 237, 0.15)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Thumbnail / Banner area */}
      <div
        className="relative aspect-video flex items-center justify-center overflow-hidden"
        style={{ background: gradient }}
      >
        {/* Decorative orb */}
        <div
          className="absolute w-32 h-32 rounded-full opacity-20 blur-2xl
                      group-hover:opacity-30 transition-opacity duration-500"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }}
        />

        {/* Stream icon */}
        <div className="text-5xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
          📺
        </div>

        {/* LIVE badge */}
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5
                      bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold
                      px-2.5 py-1 rounded-md shadow-lg shadow-red-500/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          LIVE
        </span>

        {/* Viewer count badge */}
        <span
          className="absolute top-3 right-3 flex items-center gap-1.5
                      bg-black/50 backdrop-blur-sm text-gray-200 text-xs
                      px-2.5 py-1 rounded-md"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {stream.viewerCount || 0}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Stream title */}
        <h3 className="text-white font-semibold text-base truncate group-hover:text-purple-300 transition-colors duration-200">
          {stream.title}
        </h3>

        {/* Streamer info */}
        <div className="flex items-center gap-2 mt-2.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
            }}
          >
            {avatarLetter}
          </div>
          <span className="text-gray-400 text-sm truncate">{username}</span>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
