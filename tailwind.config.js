/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        carbon: '#0B0F14',      // page background
        panel: '#101720',       // raised surfaces
        panel2: '#151E29',      // hover / nested surfaces
        line: '#1E2A38',        // borders
        ink: '#D3DEE9',         // primary text
        dim: '#7C8DA0',         // secondary text
        faint: '#4A5A6C',       // tertiary / metadata
        accent: '#5EEAD4',      // interactive teal
        manila: '#E2D3A8',      // evidence-tag paper
        manilaDim: '#8C8264',   // evidence-tag text on dark
        flag: '#F87171'         // flagged / destructive
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        tag: '0 1px 0 rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)'
      }
    }
  },
  plugins: []
}
