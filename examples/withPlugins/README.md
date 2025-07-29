# Astro Integration Kit - withPlugins Example

This example demonstrates how to use the `withPlugins` utility from Astro Integration Kit to create integrations that leverage plugins for enhanced functionality.

The action happens in the local [test-integration](./integration/index.ts) and on the [/virtual-module](http://localhost:4321/virtual-module) page in dev server.

This example uses Astro v4.

**The integration creates several virtual modules:**
- `virtual:astro-integration-kit-playground/config` 
- `virtual:playground/simple` 
- `virtual:playground/array-simple` 
- `virtual:playground/array-complex`

**It demonstrates working with plugins:**
- Uses `hasVitePluginPlugin` to detect existing Vite plugins
- Adds VitePWA plugin
- Demonstrates plugin conflict detection and warnings

**It demonstrates working with other integrations:**
- Checks if the (old) astro tailwind integration is installed
- Validates integration loading order (before/after relationships)
- Tests integration positioning relative to other integrations

Check the [Astro Integration Kit documentation](https://astro-integration-kit.netlify.app) for more details on building integrations.
