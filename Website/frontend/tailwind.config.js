/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    fontFamily: {
      'roboto': ['Roboto', 'sans-serif'],
      'lato': ['Lato', 'sans-serif'],
    },
      text: {
        'rfs': 'text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl',
      },
    boxShadow: {
      DEFAULT: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      pf: "0 0 10px 0 rgba(0, 0, 0, 0)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      none: "none"
    },
    screens: {
      "xr":"720px",
      "xs":"300px",
      "sm": "720px",
      "lg": "1024px"
    },
    container: {
      center: true,
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: 
      {
        'rank-bg': "url('../public/ranks/bg1.webp')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
       backdropBlur: {
        mms: '6px',
      },
      animation: {
        'animate': 'animate 5s linear infinite',
      },
      keyframes: {
        animate: {
          '0%, 18%, 20%, 50.1%, 60%, 80%, 90%, 92%': {
            color: '#43a9a2',
            textShadow: 'none',
          },
          '18.1%, 20.1%, 30%, 50%, 60.1%, 65%, 85%, 92%, 100%': {
            color: '#66FCF1',
            textShadow: '0 0 10px rgba(0, 255, 238, 1), 0 0 20px rgba(0, 255, 238, 1), 0 0 40px rgba(0, 255, 238, 1), 0 0 80px rgba(0, 255, 238, 1), 0 0 160px rgba(0, 255, 238, 1)',
          },
        },
      },
      colors: {
        'aqua-pong' : '#66FCF1',
        'searchbg' : '#262827',
        'my-cyan' : '#66FCF1',
        'my-grey' : '#989898',
        'tex-grey' : '#C4C4C4',
        'bgfm' : '#0D0D0D' ,
        'bgto' : '#262626',
        'profile-bg' : 'rgba(0, 0, 0, 0.241)',
        'sm-text' : '#757575',
        'hover-button' : '#3C3B3B',
        'reg-button' : '#CBDEDC',
        'reg-text' : '#5D6665',
        'gray-bg': '#0D0D0E',
        'graylight-bg': '#2E2E2E',
        'search-bg': '#66FCF1',
        'search-bg-hover': '#4B5D5C',
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
  plugins: [
    require("tailwindcss-animate"),
  ],
});