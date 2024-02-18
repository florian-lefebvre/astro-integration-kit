import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import testIntegration from "./integration";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		testIntegration({
			name: "ced",
		}),
		{
			name: "integration-a",
			hooks: {},
		},
		{
			name: "integration-b",
			hooks: {},
		},
	],
});
