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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "mesh-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%":       { transform: "translate(40px, 30px) scale(1.08)" },
          "66%":       { transform: "translate(-20px, 20px) scale(0.96)" },
        },
        "mesh-float-reverse": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%":       { transform: "translate(-40px, -30px) scale(1.1)" },
          "66%":       { transform: "translate(20px, -20px) scale(0.95)" },
        },
      },
      animation: {
        "spin-slow":           "spin-slow 6s linear infinite",
        "mesh-float":          "mesh-float 22s ease-in-out infinite",
        "mesh-float-reverse":  "mesh-float-reverse 28s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
