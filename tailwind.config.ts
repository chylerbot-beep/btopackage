import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B4332',
        'primary-light': '#2D6A4F',
        accent: '#F59E0B',
        background: '#F9F7F4',
        surface: '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        border: '#E5E0D8',
        'featured-border': '#F59E0B',
        'verified-green': '#16A34A',
        'warning-grey': '#9CA3AF',
      },
    },
  },
  plugins: [],
};

export default config;
