---
"astro-integration-kit": patch
---

Deprecates the `addDts` utility, it will be removed in a future minor release. You can anticipate this change by bumping your Astro peer dependency to ^4.14.0 and using [injectTypes](https://docs.astro.build/en/reference/integrations-reference/#injecttypes-options):

```diff
"astro:config:setup": (params) => {
-    addDts(params, {
-        name: "my-integration",
-        content: `declare module "virtual:my-integration" {}`
-    })
},
"astro:config:done": (params) => {
+    params.injectTypes({
+        filename: "types.d.ts",
+        content: `declare module "virtual:my-integration" {}`
+    })
}
```
