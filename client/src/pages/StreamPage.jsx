// ─────────────────────────────────────────────────────────
//  Stream Page — Watch a live stream + live chat
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import VideoPlayer from "../components/VideoPlayer";

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
      } catch (err) {
        console.error("Failed to fetch stream:", err.message);
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading stream...</p>
        </div>
      </div>
    );
  }

  // ── Stream offline ────────────────────────────────────

  if (!stream || !isLive) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-30">📡</div>
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Two-column layout: Video + Chat */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── Left column: Video + Stream info ──────── */}
          <div className="flex-1 min-w-0">
            {/* Video player */}
            <VideoPlayer streamKey={streamKey} />

            {/* Stream info */}
            <div className="mt-4 space-y-2">
              {/* Title */}
              <h1 className="text-2xl font-bold">{stream.title}</h1>

              {/* Streamer + live badge + viewers */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-purple-400 flex items-center gap-1.5">
                  <span className="text-lg">👤</span>
                  {streamerName}
                </span>

                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </span>

                <span className="text-gray-400 flex items-center gap-1">
                  👁 {stream.viewerCount || 0} watching
                </span>
              </div>
            </div>
          </div>

          {/* ── Right column: Live Chat ───────────────── */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col h-[500px] lg:h-[calc(56.25vw*0.5625+120px)] lg:max-h-[600px]">

              {/* Chat header */}
              <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                <span className="text-sm">💬</span>
                <h3 className="text-sm font-semibold text-white">Live Chat</h3>
                <span className="text-xs text-gray-500 ml-auto">
                  {messages.length} messages
                </span>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {messages.length === 0 && (
                  <p className="text-gray-600 text-sm text-center mt-8">
                    No messages yet. Say hello! 👋
                  </p>
                )}

                {messages.map((msg, index) => (
                  <div key={index} className="text-sm break-words">
                    <span className="font-semibold text-purple-400">
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
                className="p-3 border-t border-gray-800 flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={user ? "Send a message..." : "Login to chat"}
                  disabled={!user}
                  className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2
                             placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1
                             focus:ring-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={!user || !chatInput.trim()}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed
                             text-white text-sm font-medium px-4 py-2 rounded-lg transition"
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
