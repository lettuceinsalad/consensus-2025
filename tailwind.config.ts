import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "text-orange-500",
    "text-purple-500",
    "text-emerald-500",
    "text-blue-500",
    "text-yellow-500",
    "text-pink-500",
    "text-sky-500",
    "text-cyan-500",
    "ring-orange-500",
    "ring-purple-500",
    "ring-emerald-500",
    "ring-blue-500",
    "ring-yellow-500",
    "ring-pink-500",
    "ring-sky-500",
    "ring-cyan-500",
    "border-orange-500",
    "border-purple-500",
    "border-emerald-500",
    "border-blue-500",
    "border-yellow-500",
    "border-pink-500",
    "border-sky-500",
    "border-cyan-500",
    "bg-orange-500/10",
    "bg-purple-500/10",
    "bg-emerald-500/10",
    "bg-blue-500/10",
    "bg-yellow-500/10",
    "bg-pink-500/10",
    "bg-sky-500/10",
    "bg-cyan-500/10",
    "hover:shadow-orange-500/10",
    "hover:shadow-purple-500/10",
    "hover:shadow-emerald-500/10",
    "hover:shadow-blue-500/10",
    "hover:shadow-yellow-500/10",
    "hover:shadow-pink-500/10",
    "hover:shadow-sky-500/10",
    "hover:shadow-cyan-500/10",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
