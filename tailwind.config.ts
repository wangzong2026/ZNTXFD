import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0B0E11",
          card: "#1E2329",
          hover: "#2B3139",
        },
        foreground: {
          DEFAULT: "#EAECEF",
          muted: "#848E9C",
          disabled: "#474D57",
        },
        accent: {
          DEFAULT: "#F0B90B",
          light: "#F8D12F",
        },
        success: "#02C076",
        purple: "#8364FF",
        pink: "#FF6482",
        danger: "#F6465D",
        border: "#2B3139",
      },
      backdropBlur: {
        glass: "16px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 4s ease-in-out infinite",
        gradientShift: "gradientShift 8s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.04)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
