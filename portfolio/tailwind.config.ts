import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"; // <--- Importe como ES Module

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
    typography: {
      DEFAULT: {
        css: {
          color: '#B1B1B1',
          a: {
            color: '#22c55e', // Verde neon para links
            '&:hover': {
              color: '#4ade80',
            },
          },
          h1: { color: '#ffffff' },
          h2: { color: '#ffffff' },
          strong: { color: '#ffffff' },
          code: { color: '#4ade80' },
        },
      },
    },
  },
  },
  plugins: [
    typography, // <--- Use a variável importada aqui em vez do require
  ],
};

export default config;