import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:          '#0F172A',
          'dark-2':      '#1E293B',
          primary:       '#2563EB',
          'primary-400': '#3B82F6',
          'primary-600': '#1D4ED8',
          accent:        '#D97706',
          'accent-light':'#F59E0B',
          cream:         '#F8FAFC',
          warm:          '#EFF6FF',
          white:         '#FFFFFF',
          cyan:          '#06B6D4',
          emerald:       '#059669',
        },
        background: 'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      fontFamily: {
        sans:  ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md':'0 4px 16px rgba(0,0,0,0.08)',
        'card-lg':'0 12px 40px rgba(0,0,0,0.10)',
        blue:    '0 4px 20px rgba(37,99,235,0.35)',
      },
      keyframes: {
        'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in':    'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
    require('@tailwindcss/typography'),
  ],
}

export default config
