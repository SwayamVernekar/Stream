// ─────────────────────────────────────────────────────────
//  GoLiveModal — 3-step stream setup modal
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const GoLiveModal = ({ isOpen, onClose }) => {
  const { token, user, login } = useAuth();
  const navigate = useNavigate();

  // Step: "title" | "credentials" | "success"
  const [step, setStep] = useState("title");

  // Step 1 state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 2 state
  const [streamKey, setStreamKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [copiedField, setCopiedField] = useState(null); // "server" | "key"
  const pollRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("title");
      setTitle("");
      setDescription("");
      setError("");
      setLoading(false);
      setStreamKey("");
      setShowKey(false);
      setCopiedField(null);
    } else {
      // Clear polling on close
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
  }, [isOpen]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // ── Step 1: Start stream ───────────────────────────────

  const handleStartStream = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post(
        "/stream/start",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStreamKey(data.stream.streamKey);
      setStep("credentials");

      // Update local user state so Navbar switches to "End Stream" immediately
      login(token, { ...user, isLive: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start stream");
    } finally {
      setLoading(false);
    }
  };

  // ── Copy to clipboard ─────────────────────────────────

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
    }
  };

  // ── Step 3: Navigate to stream ────────────────────────

  const handleGoToDashboard = () => {
    onClose();
    navigate(`/stream/${streamKey}`);
  };

  // ── Render ─────────────────────────────────────────────

  if (!isOpen) return null;

  const SERVER_URL = "rtmp://20.244.26.164/live";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            className="relative w-full max-w-md bg-white/5 backdrop-blur-md
                       border border-white/10 rounded-2xl p-8 shadow-2xl z-10"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white
                         transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ── STEP 1: Title ───────────────────────── */}
            {step === "title" && (
              <form onSubmit={handleStartStream}>
                <h2
                  className="text-2xl font-bold text-white tracking-tight mb-6"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  Set up your stream
                </h2>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400
                                  px-4 py-3 rounded-xl mb-5 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-neutral-400 text-sm font-medium mb-2">
                    Stream title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What are you streaming today?"
                    required
                    className="w-full bg-white/5 border border-white/10
                               focus:border-white/30 focus:bg-white/10
                               focus:ring-2 focus:ring-white/10 text-white
                               rounded-xl px-4 py-3 placeholder-neutral-600
                               transition-all duration-200 outline-none"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-neutral-400 text-sm font-medium mb-2">
                    Description
                    <span className="text-neutral-600 font-normal ml-1">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell viewers what's happening..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10
                               focus:border-white/30 focus:bg-white/10
                               focus:ring-2 focus:ring-white/10 text-white
                               rounded-xl px-4 py-3 placeholder-neutral-600
                               transition-all duration-200 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="w-full bg-white text-black font-semibold text-sm
                             py-3 rounded-full transition-all duration-200
                             hover:bg-gray-100 disabled:opacity-40
                             disabled:cursor-not-allowed flex items-center
                             justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Starting...
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            )}

            {/* ── STEP 2: Credentials ─────────────────── */}
            {step === "credentials" && (
              <div>
                <h2
                  className="text-2xl font-bold text-white tracking-tight mb-2"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  Connect your streaming software
                </h2>
                <p className="text-neutral-500 text-sm mb-6">
                  Paste these into OBS under Settings → Stream → Custom
                </p>

                {/* Server URL */}
                <div className="mb-4">
                  <label className="block text-neutral-400 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    Server URL
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl
                                 px-4 py-3 text-white text-sm font-mono truncate"
                    >
                      {SERVER_URL}
                    </div>
                    <button
                      onClick={() => copyToClipboard(SERVER_URL, "server")}
                      className="flex-shrink-0 p-3 rounded-xl bg-white/5
                                 border border-white/10 text-neutral-400
                                 hover:text-white hover:bg-white/10
                                 transition-all duration-150"
                    >
                      {copiedField === "server" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Stream Key */}
                <div className="mb-6">
                  <label className="block text-neutral-400 text-xs font-medium mb-1.5 uppercase tracking-wider">
                    Stream Key
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl
                                 px-4 py-3 text-white text-sm font-mono truncate
                                 flex items-center gap-2"
                    >
                      <span className="truncate">
                        {showKey ? streamKey : "•".repeat(Math.min(streamKey.length, 24))}
                      </span>
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="flex-shrink-0 text-neutral-500 hover:text-white
                                   transition-colors duration-150"
                      >
                        {showKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => copyToClipboard(streamKey, "key")}
                      className="flex-shrink-0 p-3 rounded-xl bg-white/5
                                 border border-white/10 text-neutral-400
                                 hover:text-white hover:bg-white/10
                                 transition-all duration-150"
                    >
                      {copiedField === "key" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Manual go-to-stream button */}
                <button
                  onClick={handleGoToDashboard}
                  className="w-full mt-4 bg-white text-black font-semibold text-sm
                             py-3 rounded-full transition-all duration-200
                             hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                  Go to Stream Page
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* ── STEP 3: Success ─────────────────────── */}
            {step === "success" && (
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1,
                  }}
                >
                  <CheckCircle className="w-16 h-16 text-white mx-auto mb-5" strokeWidth={1.5} />
                </motion.div>

                <motion.h2
                  className="text-2xl font-bold text-white tracking-tight mb-2"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  You're live!
                </motion.h2>

                <motion.p
                  className="text-neutral-400 text-sm mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Your stream is now broadcasting
                </motion.p>

                <motion.button
                  onClick={handleGoToDashboard}
                  className="w-full bg-white text-black font-semibold text-sm
                             py-3 rounded-full transition-all duration-200
                             hover:bg-gray-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Go to Dashboard
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoLiveModal;
