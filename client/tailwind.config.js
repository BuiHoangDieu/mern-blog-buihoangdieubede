/** @type {import('tailwindcss').Config} */

import flowbite from "flowbite-react/tailwind";
import tailwindScrollbar from "tailwind-scrollbar";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      color: { darkBg: "rgba(16,23,42)" },
    },
  },
  plugins: [flowbite.plugin(), tailwindScrollbar],
};
