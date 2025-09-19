import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
// console.log("reactRouter:", reactRouter);
// console.log("tailwindcss:", tailwindcss);
// const plugins = [reactRouter(), tailwindcss()];
// console.log("plugin names:", plugins);

// https://vite.dev/config/
export default defineConfig({
	plugins: [reactRouter(), tailwindcss(), tsconfigPaths()],
});
