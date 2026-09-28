/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#fbfaf7",
        pearl: "#f3f1ec",
        mist: "#ffffff",
        ink: "#16202e",
        slate: "#5b6577",
        rose: { DEFAULT: "#c92a63", deep: "#a51f50" },
        amber: { DEFAULT: "#dd8b1f", deep: "#9a5a0c" },
        violet: "#6d4fc4",
        line: "#e4e0d7",
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
