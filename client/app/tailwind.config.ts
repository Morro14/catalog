import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,ts,jsx,tsx}"], // 👈 ensure app/ is included
	theme: {
		extend: {},
	},
	plugins: [],
} satisfies Config;
