// ─────────────────────────────────────────────────────────
//  Stream Card — YouTube-style flat layout
// ─────────────────────────────────────────────────────────

import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

const StreamCard = ({ stream }) => {
  const navigate = useNavigate();

  const username = stream.userId?.username || "Unknown";
  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <div
      onClick={() => navigate(`/stream/${stream.streamKey}`)}
      className="group cursor-pointer"
    >
      {/* Thumbnail */}
      <div
        className="aspect-video overflow-hidden rounded-xl relative transition-all duration-300
                   transition-shadow duration-300
                   group-hover:shadow-[0_0_50px_8px_rgba(255,255,255,0.25)]"
      >
        {stream.thumbnail ? (
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="w-full h-full object-cover transition-transform duration-300 ease-out
                       group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-white/[0.04] transition-transform duration-300 ease-out
                          group-hover:scale-110" />
        )}

        {/* LIVE badge — bottom right */}
        <span
          className="absolute bottom-2 right-2 flex items-center gap-1.5
                      bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider
                      px-2 py-0.5 rounded"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
          </span>
          LIVE
        </span>

        {/* Viewer count — bottom left */}
        <span
          className="absolute bottom-2 left-2 flex items-center gap-1
                      bg-black/70 text-white text-[11px]
                      px-2 py-0.5 rounded"
        >
          <Eye className="w-3 h-3" />
          {stream.viewerCount || 0}
        </span>
      </div>

      {/* Info row */}
      <div className="flex gap-3 mt-3">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center
                     bg-white/10 border border-white/10 text-white text-sm
                     font-semibold flex-shrink-0 transition-colors duration-300
                     group-hover:border-white"
        >
          {avatarLetter}
        </div>

        {/* Title + username */}
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-medium text-[15px] leading-snug line-clamp-2
                         transition-colors duration-300 group-hover:text-neutral-200">
            {stream.title}
          </h3>
          <p className="text-neutral-400 text-sm mt-0.5">
            {username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
