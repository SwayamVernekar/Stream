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
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      {/* ── Hero Section ──────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
        />
        <div
          className="absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }}
        />

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            <span className="gradient-text">Watch Live</span>
            <br />
            <span className="text-white">Streams</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-md mb-6">
            Discover creators broadcasting right now. Jump into a stream and
            join the conversation.
          </p>

          {/* Live counter */}
          {!loading && (
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full animate-fade-in">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-sm text-gray-300">
                <span className="text-white font-semibold">
                  {streams.length}
                </span>{" "}
                {streams.length === 1 ? "stream" : "streams"} live now
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Content Area ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Discovering streams...</p>
            </div>
          </div>
        )}

        {/* No streams */}
        {!loading && streams.length === 0 && (
          <div className="flex items-center justify-center py-32 animate-fade-in">
            <div className="text-center">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center glass"
                style={{ fontSize: "2rem" }}
              >
                📡
              </div>
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
            {streams.map((stream, index) => (
              <StreamCard key={stream._id} stream={stream} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
