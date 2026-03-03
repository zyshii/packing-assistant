import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'serif'],
        body: ['Raleway', 'system-ui', 'sans-serif'],
        sans: ['Raleway', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        // Earthy, natural named colors inspired by realfood.gov
        "herb-green": "#3E7050",         // Primary herb green
        "forest-green": "#2E5A3C",       // Darker herb green
        "warm-amber": "#CE8020",         // Warm amber accent
        "light-amber": "#F0E2BB",        // Light amber/golden
        "cream": "#F3F0D6",              // Warm cream (realfood.gov primary)
        "light-cream": "#F9F6E8",        // Lighter cream (card bg)
        "warm-sand": "#E5DABD",          // Sandy cream (secondary)
        "muted-sand": "#EAE4D1",         // Muted cream (muted bg)
        "terracotta": "#AB4432",         // Earthy red (destructive)
        "warm-charcoal": "#3A2A1A",      // Dark warm brown (foreground)
        "warm-gray": "#7A6E5A",          // Warm gray (muted text)
        "warm-border": "#C9C1A8",        // Subtle warm border
        "ocean-teal": "#356D80",         // Ocean teal (info/travel)
        "soft-lavender": "#7B6E8C",      // Soft lavender-plum (travel)

        // Legacy aliases (kept for backward compat with any inline usage)
        "warm-orange": "#CE8020",        // Remapped to warm amber
        "burnt-orange": "#B56B10",       // Darker amber
        "soft-peach": "#F0E2BB",         // Remapped to light amber
        "warm-beige": "#F9F6E8",         // Remapped to light cream
        "light-sand": "#E5DABD",         // Remapped to warm sand
        "deep-violet": "#7B6E8C",        // Remapped to soft lavender
        "soft-purple": "#EDE8F5",        // Light lavender bg
        "sage-green": "#357A48",         // Forest/success green
        "charcoal": "#3A2A1A",           // Remapped to warm charcoal
        "light-gray": "#A09282",         // Warm light gray
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Theme accent colors
        "travel-blue": "hsl(var(--travel-blue))",
        "travel-purple": "hsl(var(--travel-purple))",
        // WCAG compliant semantic colors
        success: {
          DEFAULT: "hsl(var(--success))",
          light: "hsl(var(--success-light))",
          foreground: "hsl(var(--success-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          light: "hsl(var(--info-light))",
          foreground: "hsl(var(--info-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          light: "hsl(var(--warning-light))",
          foreground: "hsl(var(--warning-foreground))",
        },
        neutral: {
          DEFAULT: "hsl(var(--neutral))",
          light: "hsl(var(--neutral-light))",
        },
        // Accessibility utilities
        "focus-ring": "hsl(var(--focus-ring))",
        "hover-overlay": "hsl(var(--hover-overlay))",
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
        "fadeIn": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scaleIn": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-background": "var(--gradient-background)",
      },
      boxShadow: {
        "soft": "var(--shadow-soft)",
        "card": "var(--shadow-card)",
        "floating": "var(--shadow-floating)",
        "modal": "var(--shadow-modal)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
