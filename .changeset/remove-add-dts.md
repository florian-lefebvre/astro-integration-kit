---
"astro-integration-kit": minor
---

Remove the `addDts()` utility. [`injectTypes()`](https://docs.astro.build/en/reference/integrations-reference/#injecttypes-option) should be used instead.

```diff
- "astro:config:setup": (params) => {
-     addDts(params, {
-         name: "my-integration",
-         content: `declare module "virtual:my-integration" {}`
-     })
- },
+ "astro:config:done": (params) => {
+     params.injectTypes({
+         filename: "types.d.ts",
+         content: `declare module "virtual:my-integration" {}`
+     })
+ }
``` 

