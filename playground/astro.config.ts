import { defineConfig } from "astro/config";
import playgroundIntegration from "./integration";
import { importFresh } from "./src/utils/importFresh"; // use local version so our package isn't cached

const { hmrIntegration } = await importFresh<
	typeof import("astro-integration-kit/dev")
>("astro-integration-kit/dev");

// https://astro.build/config
export default defineConfig({
	integrations: [
		playgroundIntegration(),
		hmrIntegration({ directories: ["./integration", "../packages/astro-integration-kit/dist/"] }),
	],
});
