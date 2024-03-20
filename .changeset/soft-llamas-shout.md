---
"astro-integration-kit": minor
---

Simplifies plugins generics, allowing simpler plugin builds. This should be non-breaking for plugin relying on type inference, plugins with explicitly declared signature should update the following:

```diff
type SomePlugin = Plugin<
  "utilityName",
  "astro:config:setup",
-  (p: HookParams) => (params: UtilityParams) => UtilityOutput
+  (params: UtilityParams) => UtilityOutput
>;

export const somePlugin: SomePlugin = definePlugin();
```
