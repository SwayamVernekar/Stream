// ─────────────────────────────────────────────────────────
//  Landing Page — Full-screen hero with floating paths
// ─────────────────────────────────────────────────────────

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import FloatingPaths from "../components/FloatingPaths";
import { HoverButton } from "@/components/ui/hover-button";

// ── Landing Page ─────────────────────────────────────────

const HEADLINE = "Terminal";

const Landing = () => {
  const letters = HEADLINE.split("");
  const navigate = useNavigate();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />

      {/* Subtle radial glow */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* App name — letter by letter */}
        <h1
          className="text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter leading-[0.9] mb-6"
          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        >
          {letters.map((char, i) => (
            <motion.span
              key={i}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 25,
                delay: i * 0.08,
              }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.p
          className="text-xl md:text-2xl text-neutral-400 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        >
          Go Live. Be Seen.
        </motion.p>

        {/* Subtext */}
        <motion.p
          className="text-sm text-neutral-500 max-w-md mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          The platform built for creators who are ready to be discovered.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex items-center justify-center gap-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <HoverButton
            onClick={() => navigate("/register")}
            className="px-10 py-4 text-base font-semibold"
          >
            Start Streaming
          </HoverButton>

          <HoverButton
            onClick={() => navigate("/home")}
            className="px-10 py-4 text-base font-semibold"
          >
            Watch Live
          </HoverButton>
        </motion.div>
      </div>
    </section>
  );
};

export default Landing;
