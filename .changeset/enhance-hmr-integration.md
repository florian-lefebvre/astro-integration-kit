---
"astro-integration-kit": minor
---

Enhances `hmrIntegration` with multi-directory support.

- **`hmrIntegration` directories**: Now supports watching multiple directories with the `directories` array option, while still supporting the original single `directory` option
  ```ts
  hmrIntegration({ directories: ["./integration", "../package/dist/"] })
  ```