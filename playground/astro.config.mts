import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import TestVueApp from "test-vue-app";
import testIntegration from "./integration";

const { createResolver } = await import("astro-integration-kit");
const { hmrIntegration } = await import("astro-integration-kit/dev");

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		testIntegration({
			resource: "def",
		}),
		{ name: "integration-a", hooks: {} },
		{ name: "integration-b", hooks: {} },
		TestVueApp(),
		hmrIntegration({
			directory: createResolver(import.meta.url).resolve("../package/dist"),
		}),
	],
});
