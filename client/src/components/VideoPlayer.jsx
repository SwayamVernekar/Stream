// ─────────────────────────────────────────────────────────
//  Video Player — HLS.js powered live stream player
// ─────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ streamKey }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamKey) return;

    // HLS stream URL from the RTMP-to-HLS transcoder
    const streamUrl = `http://20.244.26.164:8080/hls/${streamKey}.m3u8`;

    if (Hls.isSupported()) {
      // ── HLS.js supported (Chrome, Firefox, Edge, etc.) ──
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => {
          // Autoplay may be blocked — user will click play manually
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error("HLS fatal error:", data.type, data.details);
          setIsLoading(false);
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // ── Native HLS support (Safari) ──
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });
    }

    // Cleanup on unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamKey]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden aspect-video animate-glow"
      style={{ background: "#08080d" }}
    >
      {/* Loading spinner overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-400 text-sm">Connecting to stream...</span>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay
        controls
        muted
        playsInline
      />

      {/* Fallback message (shown if video fails to load) */}
      {!Hls.isSupported() &&
        !document.createElement("video").canPlayType("application/vnd.apple.mpegurl") && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-50">
            <p className="text-gray-400 text-center px-4">
              Your browser does not support HLS playback.
              <br />
              Please try Chrome, Firefox, or Safari.
            </p>
          </div>
        )}
    </div>
  );
};

export default VideoPlayer;
