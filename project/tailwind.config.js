/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				undisclosed: "#F4F3F1F0",
				snow: "#F4F3F1",
				ash: "#EEEEEE",
				clay: "#605858",
				coal: "#353131",
				"dark-mint": "#489078",
				alert: "#EB5757",
				"shade-24-dark": "rgba(53, 49, 49, 0.24)",
				"shade-24-light": "rgba(241, 240, 236, 0.24)",
				"shade-12-light": "rgba(241, 240, 236, 0.12)",
			},
			fontFamily: {
				sans: ['"Fira Sans"', "sans-serif"],
				fira: ['"Fira Sans"', "sans-serif"],
			},
		},
	},
	plugins: [],
};
