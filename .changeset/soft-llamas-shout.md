---
"astro-integration-kit": minor
---

Simplify Plugin generics allowing simpler plugin builds.
This should be non-breaking for plugin relying on type inference, plugins with explicitly declared signature should update the following:

```ts
// How it was
type SomePlugin = Plugin<
  "utilityName",
  "astro:config:setup",
  (p: HookParams) => (params: UtilityParams) => UtilityOutput
>;

// How it should be now
type SomePlugin = Plugin<
  "utilityName",
  "astro:config:setup",
  (params: UtilityParams) => UtilityOutput
>;

export const somePlugin: SomePlugin = definePlugin();
```
