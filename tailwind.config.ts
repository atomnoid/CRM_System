import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#1f1635",
        border: "#e9e4f6",
        unicorn: {
          primary: "#2e1065",
          accent: "#6d28d9",
          muted: "#f6f3ff"
        }
      }
    }
  },
  plugins: []
};

export default config;
