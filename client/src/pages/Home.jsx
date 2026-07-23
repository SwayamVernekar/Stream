// ─────────────────────────────────────────────────────────
//  Home Page — Displays all active live streams
// ─────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Radio } from "lucide-react";
import API from "../api/axios";
import StreamCard from "../components/StreamCard";

const POLL_INTERVAL = 10000; // Refresh every 10 seconds

// TEMP: remove before production — mock streams for UI preview
const MOCK_STREAMS = [
  { _id: "mock-1", title: "Late Night Coding Session", userId: { username: "devNinja" }, viewerCount: 342, thumbnail: "https://picsum.photos/400/225?random=1", streamKey: "mock-1", isLive: true },
  { _id: "mock-2", title: "Valorant Ranked Grind", userId: { username: "fragQueen" }, viewerCount: 128, thumbnail: "https://picsum.photos/400/225?random=2", streamKey: "mock-2", isLive: true },
  { _id: "mock-3", title: "Chill Lofi & Study", userId: { username: "studyWithMe" }, viewerCount: 57, thumbnail: "https://picsum.photos/400/225?random=3", streamKey: "mock-3", isLive: true },
  { _id: "mock-4", title: "Building a Startup Live", userId: { username: "techFounder" }, viewerCount: 489, thumbnail: "https://picsum.photos/400/225?random=4", streamKey: "mock-4", isLive: true },
  { _id: "mock-5", title: "Minecraft Survival Day 200", userId: { username: "blockMaster" }, viewerCount: 23, thumbnail: "https://picsum.photos/400/225?random=5", streamKey: "mock-5", isLive: true },
  { _id: "mock-6", title: "Guitar Jam & Requests", userId: { username: "acousticVibes" }, viewerCount: 96, thumbnail: "https://picsum.photos/400/225?random=6", streamKey: "mock-6", isLive: true },
];

const Home = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch active streams from the backend
  const fetchStreams = async () => {
    try {
      const { data } = await API.get("/stream/active");
      setStreams(data.streams);
    } catch (err) {
      console.error("Failed to fetch streams:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount + poll every 10 seconds
  useEffect(() => {
    fetchStreams();

    const interval = setInterval(fetchStreams, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // TEMP: combine mock + real streams for preview
  const allStreams = [...MOCK_STREAMS, ...streams];

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">


        {/* ── Loading: skeleton cards ─────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-white/5 rounded-xl" />
                <div className="flex gap-3 mt-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3.5 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/[0.03] rounded w-2/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ────────────────────────────── */}
        {!loading && allStreams.length === 0 && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Radio className="w-12 h-12 text-neutral-600 mx-auto mb-5" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold text-white mb-1.5">
                No one is live right now
              </h2>
              <p className="text-neutral-500 text-sm max-w-xs mx-auto">
                Check back soon or start your own stream
              </p>
            </div>
          </div>
        )}

        {/* ── Stream grid ────────────────────────────── */}
        {!loading && allStreams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
            {allStreams.map((stream) => (
              <StreamCard key={stream._id} stream={stream} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
