---
"astro-integration-kit": minor
---

Updates `deineIntegration` `setup` returned object shape to allow extra properties

Previously the return of the `setup` function passed to `defineIntegration` was the Astro hooks defined by the integration, and would be set as the `hooks` property in the final integration object.

Now, the expected return of `setup` is the properties of the integration object itself:

```ts title="my-integration.ts" ins={7,11}
import { defineIntegration } from "astro-integration-kit";

export default defineIntegration({
  name: "my-integration",
  setup({ name }) {
    return {
      hooks: {
        "astro:config:setup": () => {
          // ...
        },
      },
    };
  },
});
```

If you were using the `withPlugins` utility, you don't need to do anything since that utility now returns the updated shape.
