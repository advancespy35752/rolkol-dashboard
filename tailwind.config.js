/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pageBg: "var(--bg-page)",
        sidebarBg: "var(--bg-sidebar)",
        headerBg: "var(--bg-header)",
        cardBg: "var(--bg-card)",

        borderCard: "var(--border-card)",
        borderSoft: "var(--border-soft)",
        borderSidebar: "var(--border-sidebar)",

        textMain: "var(--text-main)",
        textDim: "var(--text-dim)",
        textMuted: "var(--text-muted)",

        accentBg: "var(--accent-bg)",
        accentBorder: "var(--accent-border)",
        accentText: "var(--accent-text)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        btn: "var(--radius-btn)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        header: "var(--shadow-header)",
      },
    },
  },
  plugins: [],
};
