---
"astro-integration-kit": minor
---

Adds `importFresh()` utility for cache-busting module imports during development.

- **`importFresh()`**: Bypasses Node.js module cache by adding timestamp query parameters, essential for hot reloading without process restarts
  ```ts
  import { importFresh } from "astro-integration-kit/dev";
  const { default: myIntegration } = await importFresh<typeof import("my-integration")>("my-integration");
  ```