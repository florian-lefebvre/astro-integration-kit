import { hmrIntegration } from "astro-integration-kit/dev";
// @ts-check
import { defineConfig } from "astro/config";
import playgroundIntegration from "./integration";

// https://astro.build/config
export default defineConfig({
	integrations: [
		playgroundIntegration(),
		hmrIntegration({ directory: "./integration" }),
		// hmrIntegration({ directory: "../package/" }),
	],
});
