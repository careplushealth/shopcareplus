/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#174D3A',       // Deep forest green
          forest: '#174D3A',     // Deep forest green alias
          primary: '#236B50',    // Primary green
          teal: '#236B50',       // Teal / Primary green alias
          hover: '#1B5640',      // Deeper hover green
          light: '#EAF2EC',      // Soft sage
          surface: '#F4F8F5',    // Very soft green tint
          offwhite: '#FAF9F6',   // Warm off-white background
          charcoal: '#242824',   // Body & headings charcoal
          muted: '#747A75',      // Secondary text
          subtle: '#8C948E',     // Tertiary subtle text
          border: '#E5E8E4',     // Light border
          borderLight: '#EFF2EE',
          gold: '#C68A4C',       // Warm gold accent
          goldLight: '#FDF8F3',
          sale: '#C94A29',       // Refined coral/terracotta badge
          saleBg: '#FDF2F0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fraunces"', '"Plus Jakarta Sans"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 14px 0 rgba(23, 77, 58, 0.06)',
        'card-hover': '0 12px 28px -4px rgba(23, 77, 58, 0.12)',
        'dropdown': '0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'drawer': '-8px 0 30px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'brand': '10px',
        'brand-lg': '16px',
        'brand-xl': '24px',
      }
    },
  },
  plugins: [],
}
