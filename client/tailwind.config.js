/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0a0a0f",
          50: "#12121a",
          100: "#16161f",
          200: "#1a1a25",
          300: "#1e1e2a",
          400: "#24242f",
        },
        accent: {
          DEFAULT: "#7C3AED",
          light: "#8B5CF6",
          dark: "#6D28D9",
          glow: "rgba(124, 58, 237, 0.25)",
        },
      },
      animation: {
        "pulse-live": "pulse-live 2s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.3)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow": {
          from: { boxShadow: "0 0 20px rgba(124, 58, 237, 0.1)" },
          to: { boxShadow: "0 0 30px rgba(124, 58, 237, 0.25)" },
        },
      },
    },
  },
  plugins: [],
};
