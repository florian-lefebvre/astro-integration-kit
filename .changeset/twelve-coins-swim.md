---
"astro-integration-kit": minor
---

Bump the minimal version of Astro to 4.12

- Removed the `AstroIntergation.ExtraHooks` workaround for extending hooks in favor of the native `Astro.IntegrationHooks` extendable interface.

  ```diff
  -namespace AstroIntergationKit {
  -  interface ExtraHooks {
  +namespace Astro {
  +  interface IntegrationHooks {
      'myLib:myHook': (params: { foo: string }) => Promise<void>;
    }
  }
  ```

- Removed the `HookParameters` type that combined the native types and the workaround above. The native `HookParameters` should be used now:

  ```diff
  - import type { HookParameters } from 'astro-integration-kit';
  + import type { HookParameters } from 'astro';
  ```

- Fixes the typing of `defineUtility` to not cause transitive dependency on non-portble Astro types when building libraries with type declarations.
