// ─────────────────────────────────────────────────────────
//  Stream Card — Displays a single live stream preview
// ─────────────────────────────────────────────────────────

import { useNavigate } from "react-router-dom";

const StreamCard = ({ stream }) => {
  const navigate = useNavigate();

  // Extract streamer username from populated userId
  const username = stream.userId?.username || "Unknown";

  return (
    <div
      onClick={() => navigate(`/stream/${stream.streamKey}`)}
      className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer
                 border border-gray-700/50 hover:border-purple-500/50
                 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10
                 transition-all duration-300 group"
    >
      {/* Thumbnail / Banner area */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-900/40 via-gray-900 to-indigo-900/40
                      flex items-center justify-center">
        {/* Animated stream placeholder */}
        <div className="text-5xl opacity-30 group-hover:opacity-50 transition-opacity">
          📺
        </div>

        {/* LIVE badge */}
        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1
                         rounded-md flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </span>

        {/* Viewer count badge */}
        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-gray-200 text-xs
                         px-2.5 py-1 rounded-md flex items-center gap-1">
          👁 {stream.viewerCount || 0}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Stream title */}
        <h3 className="text-white font-semibold text-lg truncate group-hover:text-purple-300 transition-colors">
          {stream.title}
        </h3>

        {/* Streamer info */}
        <p className="text-gray-400 text-sm mt-1.5 flex items-center gap-1.5">
          <span className="text-purple-400">👤</span>
          {username}
        </p>
      </div>
    </div>
  );
};

export default StreamCard;
