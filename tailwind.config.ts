import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // Indigo-600
          hover: '#6366f1', // Indigo-500
        },
        background: {
          DEFAULT: '#fafafa', // Neutra-50
        },
        text: {
          body: {
            DEFAULT: '#4b5563', // Gray-600
            hover: '#1f2937', // Gray-800
          },
          title: '#111827', // Gray-900
          disabled: '#d1d5db', // Gray-300
        },
        error: {
          DEFAULT: '#dc2626', // Red-600
          hover: '#ef4444', // Red-500
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
