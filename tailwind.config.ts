import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundDark: "#21242D",
        backgroundLight: "#292C35",
        primaryColor: "#21D86E",
      },
    },
  },
  plugins: [],
} satisfies Config;
