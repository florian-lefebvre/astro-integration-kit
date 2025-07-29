// @ts-check
import { defineConfig } from "astro/config";
import playgroundIntegration from "./integration1";

// https://astro.build/config
export default defineConfig({
	integrations: [playgroundIntegration()],
});
