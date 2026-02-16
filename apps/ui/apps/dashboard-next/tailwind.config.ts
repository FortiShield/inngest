import type { Config } from 'tailwindcss';
import baseConfig from '@inngest/components/tailwind.config';

const config: Config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './node_modules/@inngest/components/src/**/*.{ts,tsx}',
  ],
  presets: [baseConfig],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
