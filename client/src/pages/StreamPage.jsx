// ─────────────────────────────────────────────────────────
//  Stream Page — Watch a live stream + live chat
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import VideoPlayer from "../components/VideoPlayer";

// Rotating colors for chat usernames
const USERNAME_COLORS = [
  "#8B5CF6", "#EC4899", "#06B6D4", "#10B981",
  "#F59E0B", "#EF4444", "#3B82F6", "#A78BFA",
];

const getNameColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USERNAME_COLORS[Math.abs(hash) % USERNAME_COLORS.length];
};

const StreamPage = () => {
  const { streamKey } = useParams();
  const { user } = useAuth();

  // Stream data state
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);

  // ── Fetch stream details ─────────────────────────────

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const { data } = await API.get(`/stream/${streamKey}`);
        setStream(data.stream);
        setIsLive(data.stream.isLive);
      } catch {
        // Stream not found or offline — handled by UI below
        setStream(null);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [streamKey]);

  // ── Socket.io connection ──────────────────────────────

  useEffect(() => {
    // Connect to the backend socket server
    const socket = io("http://20.244.26.164:5001");
    socketRef.current = socket;

    // Join the stream's chat room
    socket.on("connect", () => {
      socket.emit("join-stream", streamKey);
    });

    // Listen for incoming chat messages
    socket.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [streamKey]);

  // ── Auto-scroll chat to bottom ────────────────────────

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send a chat message ───────────────────────────────

  const sendMessage = (e) => {
    e.preventDefault();

    const trimmed = chatInput.trim();
    if (!trimmed || !socketRef.current) return;

    const username = user?.username || "Anonymous";

    socketRef.current.emit("chat-message", {
      streamKey,
      message: trimmed,
      username,
    });

    setChatInput("");
  };

  // ── Loading state ─────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading stream...</p>
        </div>
      </div>
    );
  }

  // ── Stream offline ────────────────────────────────────

  if (!stream || !isLive) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div className="text-center animate-fade-in">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center glass"
            style={{ fontSize: "2rem" }}
          >
            📡
          </div>
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            Stream is offline
          </h2>
          <p className="text-gray-500 text-sm max-w-sm">
            This stream is not currently live. Check back later!
          </p>
        </div>
      </div>
    );
  }

  // ── Stream is live — full layout ──────────────────────

  const streamerName = stream.userId?.username || "Unknown";
  const avatarLetter = streamerName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen text-white" style={{ background: "#0a0a0f" }}>
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        {/* Two-column layout: Video + Chat */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── Left column: Video + Stream info ──────── */}
          <div className="flex-1 min-w-0">
            {/* Video player */}
            <VideoPlayer streamKey={streamKey} />

            {/* Stream info */}
            <div className="mt-4 space-y-3">
              {/* Title */}
              <h1 className="text-2xl font-bold text-white">{stream.title}</h1>

              {/* Streamer + live badge + viewers */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Avatar + name */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                    }}
                  >
                    {avatarLetter}
                  </div>
                  <span className="text-purple-400 font-semibold">
                    {streamerName}
                  </span>
                </div>

                {/* LIVE badge */}
                <span
                  className="flex items-center gap-1.5 bg-red-600/90 text-white text-xs font-bold
                              px-2.5 py-1 rounded-md"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  LIVE
                </span>

                {/* Viewer count */}
                <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <svg
                    className="w-4 h-4"
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
                  {stream.viewerCount || 0} watching
                </span>
              </div>
            </div>
          </div>

          {/* ── Right column: Live Chat ───────────────── */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="glass-strong rounded-2xl flex flex-col h-[500px] lg:h-[calc(56.25vw*0.5+90px)] lg:max-h-[600px]">

              {/* Chat header */}
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full bg-green-500"
                  style={{ boxShadow: "0 0 6px rgba(34, 197, 94, 0.5)" }}
                />
                <h3 className="text-sm font-semibold text-white">Live Chat</h3>
                <span className="text-xs text-gray-600 ml-auto">
                  {messages.length} {messages.length === 1 ? "msg" : "msgs"}
                </span>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-3xl mb-3 opacity-30">💬</div>
                    <p className="text-gray-600 text-sm">
                      No messages yet. Say hello! 👋
                    </p>
                  </div>
                )}

                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className="text-sm break-words py-1 px-2 rounded-lg hover:bg-white/[0.03] transition-colors animate-slide-up"
                  >
                    <span
                      className="font-semibold"
                      style={{ color: getNameColor(msg.username) }}
                    >
                      {msg.username}
                    </span>
                    <span className="text-gray-300 ml-1.5">
                      {msg.message}
                    </span>
                  </div>
                ))}

                {/* Invisible div to scroll to */}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <form
                onSubmit={sendMessage}
                className="p-3 border-t border-white/5 flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={user ? "Send a message..." : "Login to chat"}
                  disabled={!user}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5
                             placeholder-gray-600 input-glow transition-all duration-200
                             disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!user || !chatInput.trim()}
                  className="btn-gradient text-white text-sm font-medium px-4 py-2.5 rounded-xl
                             disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none
                             disabled:bg-gray-800 disabled:bg-none"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamPage;
