/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // Définir l'animation de défilement vers la gauche
        rouletteScroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        // Nommer l'animation pour pouvoir l'utiliser dans votre composant
        'roulette-scroll': 'rouletteScroll 2s linear infinite',
      },
    },
  },
  plugins: [],
};
