import tailwind from "@astrojs/tailwind";
import packageName from "astro-kit";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		packageName(),
	],
});
