---
"astro-integration-kit": minor
---

Remove the `addDts()` utility. [`injectTypes()`](https://docs.astro.build/en/reference/integrations-reference/#injecttypes-option) should be used instead

Adds `importFresh()` utility for cache-busting module imports during development and enhances `hmrIntegration` with multi-directory support.

- **`importFresh()`**: Bypasses Node.js module cache by adding timestamp query parameters, essential for hot reloading without process restarts
  ```ts
  import { importFresh } from "astro-integration-kit/dev";
  const { default: myIntegration } = await importFresh<typeof import("my-integration")>("my-integration");
  ```

- **`hmrIntegration` directories**: Now supports watching multiple directories with the `directories` array option, while still supporting the original single `directory` option
  ```ts
  hmrIntegration({ directories: ["./integration", "../package/dist/"] })
  ```