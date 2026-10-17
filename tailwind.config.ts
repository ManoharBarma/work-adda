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
        background: "var(--background)",
        foreground: "var(--foreground)",
        rausch: {
          DEFAULT: "#FF385C",
          50: "#FFF1F3",
          100: "#FFE4E8",
          200: "#FFCCD5",
          500: "#FF385C",
          600: "#E00B41",
          700: "#D7043A",
        },
        ink: {
          DEFAULT: "#222222",
          body: "#484848",
          muted: "#717171",
          subtle: "#B0B0B0",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F7F7F7",
          hover: "#F2F2F2",
        },
        hairline: {
          DEFAULT: "#EBEBEB",
          strong: "#DDDDDD",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          hover: "#20BA5A",
          subtle: "#E8FBF0",
        },
      },
      boxShadow: {
        'airbnb': '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'airbnb-card': '0 4px 14px rgba(0, 0, 0, 0.06)',
        'airbnb-hover': '0 10px 28px rgba(0, 0, 0, 0.12)',
        'airbnb-pill': '0 3px 12px rgba(0, 0, 0, 0.10)',
        'airbnb-bottom': '0 -4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
export default config;
