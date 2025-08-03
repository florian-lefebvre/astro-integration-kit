---
"astro-integration-kit": minor
---

Adds `importFresh()` utility for cache-busting module imports during development.

- **`importFresh()`**: Bypasses Node.js module cache by adding timestamp query parameters, essential for hot reloading without process restarts
  ```ts
  import { importFresh } from "astro-integration-kit/dev";
  const { default: myIntegration } = await importFresh<typeof import("my-integration")>("my-integration");
  
  // For relative paths, provide import.meta.url as second parameter
  const { default: localIntegration } = await importFresh<typeof import("./integration")>("./integration", import.meta.url);
  ```
- **Automatic resolution**: For relative paths, automatically tries common file extensions (.js, .ts, .mjs, .cjs) and /index.* suffixes when the exact path doesn't exist