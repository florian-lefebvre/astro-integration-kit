---
"astro-integration-kit": minor
"examples-withplugins": patch
---

---

## "astro-integration-kit": minor

- **Removed `addDts` utility**: This utility has been deprecated and removed. Users should manage TypeScript declarations
  manually or use alternative approaches.

- **Added `importFresh` function**: New development utility for cache-busting imports in Astro 5+. Use this in your `astro.config.mjs` to ensure fresh imports of your integration during development when using bare specifiers.

- **Changed** `hmrIntegration` to accept `directory` or `directories` for watching multiple directories, not a breaking change 

- **Enhanced documentation**: Completely restructured and improved documentation for better clarity and consistency

  - Merged installation and usage pages for streamlined getting started experience
  - Improved core utility docs (`definePlugin`, `defineUtility`, `createResolver`) with better examples and clearer structure
  - Updated HMR integration docs to use `importFresh` for Astro 5+ compatibility

- **Simplified playground**: Streamlined the playground setup and moved the complex example to `examples/withPlugins` for reference

- **Reorganized examples**: Moved the original feature-rich playground to `examples/withPlugins` to serve as a comprehensive reference implementation

- **Linting**: removed warnings about explict any and fixed suppression comments, and applied biome formatting to all files

This release focuses on improving the developer experience with better documentation, removing deprecated features, and adding essential tooling for Astro 5+ development workflows.
