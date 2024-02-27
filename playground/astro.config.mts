import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import testIntegration from "./integration";
import TestVueApp from "test-vue-app";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		testIntegration({
			resource: "abc",
		}),
		{ name: "integration-a", hooks: {} },
		{ name: "integration-b", hooks: {} },
		TestVueApp(),
	],
});
