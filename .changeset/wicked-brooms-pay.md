---
"astro-integration-kit": patch
---

Updates the `hasIntegration` utility to support relative position check

When using extended hooks, the `hasIntegration` now accepts two optional arguments, one for relative position and one for a reference to the relative position.
Those fields allow checking for the presence of an integration positioned before or after another in the Astro Config:

```ts
// Check if Tailwind is installed before the current integration
hasIntegration("@astrojs/tailwind", "before");

// Check if Tailwind is installed after the current integration
hasIntegration("@astrojs/tailwind", "after");

// Check if Tailwind is installed before the MDX integration
hasIntegration("@astrojs/tailwind", "before", "@astrojs/mdx");

// Check if Tailwind is installed after the MDX integration
hasIntegration("@astrojs/tailwind", "after", "@astrojs/mdx");
```

When using standalone utilities, the `hasIntegration` utility now accept two optional fields:
- `position` to enable checking the relative position of the integration.
- `relativeTo` the integration to compare agains when checking for relative position.

Since standalone utilities don't have the context of the current integration, checking for a relative position must include a `relativeTo`, throwing an error if one is not passed in.

```ts
// Check if Tailwind is installed before the MDX integration
hasIntegration({
    name: "@astrojs/tailwind",
    position: "before",
    relativeTo: "@astrojs/mdx",
    config: config,
});

// Check if Tailwind is installed after the MDX integration
hasIntegration({
    name: "@astrojs/tailwind",
    position: "after",
    relativeTo: "@astrojs/mdx",
    config: config,
});

// Rejected by TypeScript and throws at runtime
hasIntegration({
    name: "@astrojs/tailwind",
    position: "before",
    config: config,
});
```

If `position` is `undefined` or absent the utility will only check whether the integration is installed as it was before.

