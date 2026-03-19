/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                outfit: ["Outfit", "sans-serif"],
                sans: ["DM Sans", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            colors: {
                background: "#FFF8F0",
                foreground: "#2D2A26",
                card: {
                    DEFAULT: "#FFFFFF",
                    foreground: "#2D2A26",
                },
                primary: {
                    DEFAULT: "#FF6B6B",
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#FFE66D",
                    foreground: "#2D2A26",
                },
                accent: {
                    DEFAULT: "#4ECDC4",
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#F7F2EB",
                    foreground: "#888278",
                },
                border: "#E6DDD0",
                input: "#FFFBF5",
                ring: "#FF6B6B",
                fruitee: {
                    orange: "#FF8A3D",
                    pink: "#FF6B95",
                    yellow: "#FFE66D",
                    teal: "#4ECDC4",
                    coral: "#FF6B6B",
                    cream: "#FFF8F0",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                soft: "0 8px 30px rgb(0,0,0,0.04)",
                floating: "0 20px 50px rgb(0,0,0,0.1)",
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
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                float: "float 3s ease-in-out infinite",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
