/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#faf9f5",
        pearl: "#f0eee6",
        mist: "#ffffff",
        ink: "#16202e",
        // DEFAULT keeps `text-slate` as before; the numbered shades are Tailwind's stock slate,
        // used by the How it works section, which mirrors quillstudio.tech.
        slate: {
          DEFAULT: "#5b6577",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        rose: { DEFAULT: "#c92a63", deep: "#a51f50" },
        amber: { DEFAULT: "#dd8b1f", deep: "#9a5a0c" },
        violet: "#6d4fc4",
        line: "#e8e6dc",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "Cambria", '"Times New Roman"', "serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      maxWidth: { prose: "68ch" },
    },
  },
  plugins: [],
};
