import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0a0b",
          900: "#111113",
          800: "#1a1a1d",
          700: "#26262b",
          600: "#3a3a42",
          500: "#5a5a64",
          400: "#8a8a94",
          300: "#b8b8c0",
          200: "#dcdce0",
          100: "#f0f0f2",
          50: "#fafafa",
        },
        ember: {
          400: "#ffb547",
          500: "#ff9a1f",
          600: "#e17a00",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
