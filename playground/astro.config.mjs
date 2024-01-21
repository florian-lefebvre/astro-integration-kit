import tailwind from "@astrojs/tailwind";
import testIntegration from "./integration";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		testIntegration()
	],
});
