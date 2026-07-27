/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'secondary-fixed': '#ffdadc',
        'on-primary-fixed': '#120068',
        'primary': '#4129e7',
        'on-surface-variant': '#464556',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'outline': '#777588',
        'on-tertiary-fixed': '#191c1e',
        'primary-fixed': '#e3dfff',
        'secondary': '#ad2d47',
        'outline-variant': '#c7c4d9',
        'on-secondary': '#ffffff',
        'inverse-primary': '#c4c0ff',
        'secondary-container': '#fd6a80',
        'surface-container-lowest': '#ffffff',
        'inverse-on-surface': '#f0f0f7',
        'on-primary-fixed-variant': '#340edd',
        'on-background': '#1a1c20',
        'error': '#ba1a1a',
        'on-tertiary-fixed-variant': '#44474a',
        'tertiary': '#505355',
        'surface-variant': '#e2e2e9',
        'on-surface': '#1a1c20',
        'surface': '#f9f9ff',
        'tertiary-fixed-dim': '#c5c6c9',
        'surface-container-highest': '#e2e2e9',
        'on-primary': '#ffffff',
        'surface-bright': '#f9f9ff',
        'inverse-surface': '#2e3036',
        'on-error': '#ffffff',
        'primary-container': '#5b4bff',
        'tertiary-container': '#686b6e',
        'on-primary-container': '#ede9ff',
        'on-secondary-fixed-variant': '#8c1231',
        'background': '#f9f9ff',
        'tertiary-fixed': '#e1e2e5',
        'secondary-fixed-dim': '#ffb2b9',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#ebecef',
        'surface-container': '#ededf4',
        'on-secondary-fixed': '#400010',
        'primary-fixed-dim': '#c4c0ff',
        'surface-tint': '#4e3bf3',
        'on-secondary-container': '#6c0020',
        'surface-dim': '#d9d9e0',
        'surface-container-high': '#e8e7ef',
        'surface-container-low': '#f3f3fa'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px'
      },
      spacing: {
        gutter: '24px',
        'margin-desktop': '64px',
        base: '8px',
        'container-max': '1280px',
        'margin-mobile': '20px'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
