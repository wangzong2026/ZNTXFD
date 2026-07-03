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
        success: "#0ECB81",
        danger: "#F6465D",
        border: "#2B3139",
      },
    },
  },
  plugins: [],
};

export default config;
