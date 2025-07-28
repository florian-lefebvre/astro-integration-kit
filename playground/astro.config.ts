import { defineConfig } from "astro/config";
import playgroundIntegration from "./integration";
import { importFresh } from "./integration/importFresh";

const { hmrIntegration } = await importFresh<
  typeof import("astro-integration-kit/dev")
>("astro-integration-kit/dev");

// https://astro.build/config
export default defineConfig({
  integrations: [
    playgroundIntegration(),
    hmrIntegration({ directories: ["../package/dist", "./integration"] }),
  ],
});
