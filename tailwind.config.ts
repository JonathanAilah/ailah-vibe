import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        'ink': '#0A0611',
        'panel-deep': '#120A1E',
        'panel-raised': '#160D24',
        'surface-violet': '#1E1233',
        
        // Purples
        'purple-mid': '#3A2A5C',
        'purple-deep-1': '#2a1550',
        'purple-deep-2': '#1a0f2e',
        
        // Violets (primary accent)
        'violet-accent': '#8B5CF6',
        'lavender': '#E7DEF8',
        'lavender-muted': '#C9B6EF',
        'lavender-dim': '#A99BC9',
        'lavender-darker': '#9384B8',
        'lavender-darkest': '#8A7BB0',
        'muted-purple': '#5B4A7E',
        
        // Orange (primary CTA)
        'orange-primary': '#FF8A21',
        'orange-bright': '#FFA24D',
        'orange-light': '#FFCE9A',
        
        // Success/accent
        'success-green': '#7EE0A8',
      },
      fontFamily: {
        'chakra': ['Chakra Petch', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'grotesk': ['Space Grotesk', 'sans-serif'],
      },
      fontSize: {
        'xs': '10px',
        'sm': '13px',
        'base': 'clamp(16px, 1.5vw, 19px)',
        'lg': '23px',
        'xl': 'clamp(30px, 4vw, 52px)',
        '2xl': 'clamp(42px, 6vw, 84px)',
      },
      borderRadius: {
        'sm': '9px',
        'md': '16px',
        'lg': '18px',
        'xl': '22px',
        'full': '100px',
      },
      boxShadow: {
        'card': '0 24px 60px rgba(0, 0, 0, 0.5)',
        'card-lg': '0 30px 80px rgba(0, 0, 0, 0.45)',
        'orange-glow': '0 8px 26px rgba(255, 138, 33, 0.4)',
        'orange-glow-hover': '0 12px 34px rgba(255, 138, 33, 0.55)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(90deg, #8B5CF6, #FF8A21)',
        'gradient-hero': 'linear-gradient(120deg, #1a0f2e, #3A2A5C 60%, #2a1550)',
        'gradient-card': 'linear-gradient(180deg, rgba(30, 18, 51, 0.7), rgba(18, 10, 30, 0.7))',
        'stripe-violet': 'repeating-linear-gradient(45deg, #1E1233, #1E1233 12px, #160D24 12px, #160D24 24px)',
        'stripe-orange': 'repeating-linear-gradient(45deg, #2a1a12, #2a1a12 12px, #1E1233 12px, #1E1233 24px)',
      },
      borderColor: {
        'violet-border': 'rgba(139, 92, 246, 0.22)',
        'orange-border': 'rgba(255, 138, 33, 0.28)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floaty2: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        livePulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(139, 92, 246, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        sheen: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        gridmove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '44px 44px' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        floaty2: 'floaty2 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'live-pulse': 'livePulse 2s infinite',
        blink: 'blink 1s step-end infinite',
        marquee: 'marquee 30s linear infinite',
        sheen: 'sheen 3s infinite',
        gridmove: 'gridmove 20s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
