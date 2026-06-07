// ─────────────────────────────────────────────────────────
//  Home Page — Displays all active live streams
// ─────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import API from "../api/axios";
import StreamCard from "../components/StreamCard";

const POLL_INTERVAL = 10000; // Refresh every 10 seconds

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-red-500 animate-pulse">●</span>
            Live Streams
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Watch what's happening right now
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading streams...</p>
            </div>
          </div>
        )}

        {/* No streams */}
        {!loading && streams.length === 0 && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-30">📡</div>
              <h2 className="text-xl font-semibold text-gray-300 mb-2">
                No streams live right now
              </h2>
              <p className="text-gray-500 text-sm max-w-sm">
                When someone goes live, their stream will appear here.
                Check back later or start your own!
              </p>
            </div>
          </div>
        )}

        {/* Streams grid */}
        {!loading && streams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <StreamCard key={stream._id} stream={stream} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
