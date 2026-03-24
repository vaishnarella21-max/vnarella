import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#EA580C",
          600: "#E85D04",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        accent: {
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        cream: {
          50:  "#FAFAF7",
          100: "#F5F5F0",
          200: "#EDEDEA",
        },
        warm: {
          900: "#1C1917",
          800: "#292524",
          700: "#44403C",
          600: "#57534E",
          400: "#A8A29E",
          300: "#D6D3D1",
          200: "#E7E5E4",
          100: "#F5F5F4",
        },
      },
      fontFamily: {
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      animation: {
        "fade-in":   "fade-in 0.5s ease-out",
        "slide-up":  "slide-up 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float":     "float 6s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
