// @ts-check
import { defineConfig } from "astro/config";
import { importFresh } from "./integration/importFresh";
import playgroundIntegration from "./integration";

const { hmrIntegration } = await importFresh("astro-integration-kit/dev");

// https://astro.build/config
export default defineConfig({
  integrations: [
    playgroundIntegration(),
    hmrIntegration({ directories: ["../package/dist", "./integration"] }),
  ],
});
