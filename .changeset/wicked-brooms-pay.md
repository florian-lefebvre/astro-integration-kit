---
"astro-integration-kit": patch
---

Updates the `hasIntegration` utility to support relative position check

`hasIntegration` now accepts optional parameters to check for the presence of an integration positioned before or after in the Astro Config:

```ts
hasIntegration("@astrojs/tailwind", {
	position: "before" // "after"
});
```

Note that it is undefined by default and will just check for the presence of the integration, no matter its position.

