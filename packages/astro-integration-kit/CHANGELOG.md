# astro-integration-kit

## 0.19.1

### Patch Changes

- [#133](https://github.com/florian-lefebvre/astro-integration-kit/pull/133) [`0b1d04e`](https://github.com/florian-lefebvre/astro-integration-kit/commit/0b1d04e59611695a08972ce455334a65c2f16191) Thanks [@florian-lefebvre](https://github.com/florian-lefebvre)! - Bumps version, no code change

## 0.19.0

### Minor Changes

- c10bfeb: Adds `importFresh()` utility for cache-busting module imports during development.

  - **`importFresh()`**: Bypasses Node.js module cache by adding timestamp query parameters, essential for hot reloading without process restarts

    ```ts
    import { importFresh } from "astro-integration-kit/dev";
    const { default: myIntegration } = await importFresh<
      typeof import("my-integration")
    >("my-integration");

    // For relative paths, provide import.meta.url as second parameter
    const { default: localIntegration } = await importFresh<
      typeof import("./integration")
    >("./integration", import.meta.url);
    ```

  - **Automatic resolution**: For relative paths, automatically tries common file extensions (.js, .ts, .mjs, .cjs) and /index.\* suffixes when the exact path doesn't exist

- c10bfeb: Enhances `hmrIntegration` with multi-directory support.

  - **`hmrIntegration` directories**: Now supports watching multiple directories with the `directories` array option, while still supporting the original single `directory` option
    ```ts
    hmrIntegration({ directories: ["./integration", "../package/dist/"] });
    ```

- c10bfeb: Remove the `addDts()` utility. [`injectTypes()`](https://docs.astro.build/en/reference/integrations-reference/#injecttypes-option) should be used instead.

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

## 0.18.0

### Minor Changes

- 1ea0542: Adds support for Astro 5.0

## 0.17.0

### Minor Changes

- 6a23951: Adds support for Astro 5.0 beta

## 0.16.1

### Patch Changes

- e2f85b5: Deprecates the `addDts` utility, it will be removed in a future minor release. You can anticipate this change by bumping your Astro peer dependency to ^4.14.0 and using [injectTypes](https://docs.astro.build/en/reference/integrations-reference/#injecttypes-options):

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

- e2f85b5: Fixes an `addDts` incompatibility with Astro >=4.14.0

## 0.16.0

### Minor Changes

- 8d5a476: Improve emitted inferred types for libraries

  For the following code:

  ```ts
  export const utility = defineUtility('astro:config:setup')((
  	params: HookParameters<'astro:config:setup'>,
  	options: { name: string }
  ) => {
  	// do something
  });

  export const integration defineIntegration({
  	name: 'some-integration',
  	setup: () => ({
  		hooks: {
  			'astro:config:setup': (params) => {
  				// do something
  			},
  		},
  		something: (it: string): string => it,
  	}),
  });
  ```

  Previously, the emitted declarations would be:

  ```ts
  import * as astro from "astro";
  import { AstroIntegrationLogger } from "astro";

  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};

  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
      ? DeepPartial<U>[]
      : T[P] extends object | undefined
      ? DeepPartial<T[P]>
      : T[P];
  };

  export const utility: (
    params: {
      config: astro.AstroConfig;
      command: "dev" | "build" | "preview";
      isRestart: boolean;
      updateConfig: (
        newConfig: DeepPartial<astro.AstroConfig>
      ) => astro.AstroConfig;
      addRenderer: (renderer: astro.AstroRenderer) => void;
      addWatchFile: (path: URL | string) => void;
      injectScript: (stage: astro.InjectedScriptStage, content: string) => void;
      injectRoute: (injectRoute: astro.InjectedRoute) => void;
      addClientDirective: (directive: astro.ClientDirectiveConfig) => void;
      addDevOverlayPlugin: (entrypoint: string) => void;
      addDevToolbarApp: (entrypoint: astro.DevToolbarAppEntry | string) => void;
      addMiddleware: (mid: astro.AstroIntegrationMiddleware) => void;
      logger: AstroIntegrationLogger;
    },
    options: {
      name: string;
    }
  ) => void;
  export const integration: () => astro.AstroIntegration &
    Prettify<
      Omit<
        ReturnType<
          () => {
            hooks: {
              "astro:config:setup": (params: {
                config: astro.AstroConfig;
                command: "dev" | "build" | "preview";
                isRestart: boolean;
                updateConfig: (
                  newConfig: DeepPartial<astro.AstroConfig>
                ) => astro.AstroConfig;
                addRenderer: (renderer: astro.AstroRenderer) => void;
                addWatchFile: (path: URL | string) => void;
                injectScript: (
                  stage: astro.InjectedScriptStage,
                  content: string
                ) => void;
                injectRoute: (injectRoute: astro.InjectedRoute) => void;
                addClientDirective: (
                  directive: astro.ClientDirectiveConfig
                ) => void;
                addDevOverlayPlugin: (entrypoint: string) => void;
                addDevToolbarApp: (
                  entrypoint: astro.DevToolbarAppEntry | string
                ) => void;
                addMiddleware: (mid: astro.AstroIntegrationMiddleware) => void;
                logger: AstroIntegrationLogger;
              }) => void;
            };
            something: (it: string) => string;
          }
        >,
        keyof astro.AstroIntegration
      >
    >;
  ```

  Now the emitted declarations would be:

  ```ts
  import * as astro from "astro";
  import * as astro_integration_kit from "astro-integration-kit";

  export const utility: astro_integration_kit.HookUtility<
    "astro:config:setup",
    [
      options: {
        name: string;
      }
    ],
    void
  >;
  export const integration: () => astro.AstroIntegration & {
    something: (it: string) => string;
  };
  ```

## 0.15.0

### Minor Changes

- e035a87: Bumps the minimal version of Astro to 4.12

  - Removes the `AstroIntegration.ExtraHooks` workaround for extending hooks in favor of the native `Astro.IntegrationHooks` extendable interface:

    ```diff
    -namespace AstroIntegrationKit {
    -  interface ExtraHooks {
    +namespace Astro {
    +  interface IntegrationHooks {
        'myLib:myHook': (params: { foo: string }) => Promise<void>;
      }
    }
    ```

  - Removes the `HookParameters` type that combined the native types and the workaround above. The native `HookParameters` should be used now:

    ```diff
    - import type { HookParameters } from 'astro-integration-kit';
    + import type { HookParameters } from 'astro';
    ```

  - Fixes the typing of `defineUtility` to not cause transitive dependency on non-portble Astro types when building libraries with type declarations.

## 0.14.0

### Minor Changes

- 25c72f6: Adds a new `defineAllHooksPlugin` helper for plugins that provide APIs for any hook, including third-party hooks.

### Patch Changes

- 676438b: Fixes initialization of plugins when necessary hooks are not used by consumer integrations

## 0.13.3

### Patch Changes

- 7f434df: Upgrades dependencies

## 0.13.2

### Patch Changes

- f213bf6: Expands typing support for Astro DB 0.11

## 0.13.1

### Patch Changes

- d25f27e: Fixes autocomplete and intellisense for non-core hooks

## 0.13.0

### Minor Changes

- 1c8a6f5: Simplifies emitted declarations for plugins.

  This avoids problems with too complex or non-portable types for published libraries offering plugins. Previously a simple plugin would result in a declaration like this:

  ```ts
  declare const hookProviderPlugin: astro_integration_kit.Plugin<"hook-provider", {
      'astro:config:setup': ({ config }: {
          config: astro.AstroConfig;
          command: "dev" | "build" | "preview";
          isRestart: boolean;
          updateConfig: (newConfig: DeepPartial<astro.AstroConfig>) => astro.AstroConfig;
          addRenderer: (renderer: astro.AstroRenderer) => void;
          addWatchFile: (path: string | URL) => void;
          injectScript: (stage: astro.InjectedScriptStage, content: string) => void;
          injectRoute: (injectRoute: astro.InjectedRoute) => void;
          addClientDirective: (directive: astro.ClientDirectiveConfig) => void;
          addDevOverlayPlugin: (entrypoint: string) => void;
          addDevToolbarApp: (entrypoint: string | astro.DevToolbarAppEntry) => void;
          addMiddleware: (mid: astro.AstroIntegrationMiddleware) => void;
          logger: astro.AstroIntegrationLogger;
      }) => {
          doThing: (thing: string) => void;
      };
  };
  ```

  Now, the same plugin will emit the following simplified declaration, without inlining any of the AstroHooks types:

  ```ts
  declare const hookProviderPlugin: astro_integration_kit.Plugin<"hook-provider", {
      'astro:config:setup': {
          doThing: (thing: string) => void;
      };
  };
  ```

  As shown above, this simplification also removes the unneeded re-declaration of the plugin hook input, which is a breaking change if you are declaring your generic explicitly.

### Patch Changes

- d04a410: Expands typing support for Astro DB 0.10
- 0fb9b47: Simplifies emitted declarations for dependent integrations.

  Previously an integration using Astro Integration Kit and publishing to NPM with their type declarations would generate a type like this:

  ```ts
  declare const _default: (options?: undefined) => astro.AstroIntegration & {
    hooks: {
      "astro:config:setup": (params: {
        config: astro.AstroConfig;
        command: "dev" | "build" | "preview";
        isRestart: boolean;
        updateConfig: (
          newConfig: DeepPartial<astro.AstroConfig>
        ) => astro.AstroConfig;
        addRenderer: (renderer: astro.AstroRenderer) => void;
        addWatchFile: (path: string | URL) => void;
        injectScript: (
          stage: astro.InjectedScriptStage,
          content: string
        ) => void;
        injectRoute: (injectRoute: astro.InjectedRoute) => void;
        addClientDirective: (directive: astro.ClientDirectiveConfig) => void;
        addDevOverlayPlugin: (entrypoint: string) => void;
        addDevToolbarApp: (
          entrypoint: string | astro.DevToolbarAppEntry
        ) => void;
        addMiddleware: (mid: astro.AstroIntegrationMiddleware) => void;
        logger: astro.AstroIntegrationLogger;
      }) => void;
    };
    addExtraPage: (page: string) => void;
  };
  ```

  Such inlining of the Astro hook parameter types not only makes your published package include unnecessary code, but can also make it fail to compile if you use a hook that inlines a reference to a transitive dependency:

  ```
  error TS2742: The inferred type of 'default' cannot be named without a reference to '.pnpm/vite@5.2.10_@types+node@20.12.7/node_modules/vite'. This is likely not portable. A type annotation is necessary.
  ```

  Now, the same integration will emit the following simplified declaration, without inlining any of the AstroHooks types:

  ```ts
  declare const _default: (options?: undefined) => astro.AstroIntegration & {
    addExtraPage: (page: string) => void;
  };
  ```

## 0.12.0

### Minor Changes

- 76e7343: Removes the `addDevtoolbarFrameworkApp` utility in favor of `defineToolbarApp` added in Astro 4.7.0

## 0.11.3

### Patch Changes

- cc1e92b: Fixes a case where the wrong content was passed when using `addVirtualImports` with `imports` as an array

## 0.11.2

### Patch Changes

- 647c1ba: Fixes a typo

## 0.11.1

### Patch Changes

- 5228a57: Adds core bypass flag to `addVirtualImports`

## 0.11.0

### Minor Changes

- 29d6305: Updates `defineIntegration` `setup` returned object shape to allow extra properties

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

  If you are using the `withPlugins` utility, you don't need to do anything since that utility now returns the updated shape.

## 0.10.0

### Minor Changes

- 6bf1a25: Renames `watchIntegration` to `watchDirectory`
- 6bf1a25: Exposes a new `hmrIntegration` integration from `astro-integration-kit`. It's now recommended inside your local playground to benefit from development HMR instead of using the `watchIntegration` utility

## 0.9.0

### Minor Changes

- 083438d: Plugins are no longer passed to `defineIntegration`. Instead, there's a new `withPlugins` utility. **This is a breaking change**, check out the [migration guide](https://astro-integration-kit.netlify.app/getting-started/breaking-changes/#090)
- 967ca76: The `Plugin` type and `definePlugin` signatures have been updated. **This is a breaking change**, check out the [migration guide](https://astro-integration-kit.netlify.app/getting-started/breaking-changes/#090)

## 0.8.0

### Minor Changes

- 4faa81b: Adds a new `defineUtility` utility, [see docs](https://astro-integration-kit.netlify.app/core/define-utility/)
- 4faa81b: Reworks all utilities to use the new `defineUtility`. Most core plugins are removed. **This is a breaking change**, check out the [migration guide](https://astro-integration-kit.netlify.app/getting-started/breaking-changes/#080)

### Patch Changes

- 4faa81b: Improves documentation

## 0.7.1

### Patch Changes

- 23a41b8: Fixes runtime error when importing the new DB type extension
- 23a41b8: Fixes ESM import resolution after new build step

## 0.7.0

### Minor Changes

- 236bfbe: Introduces a build step internally that fixes a few types issues for integrations authors. This _should_ be non-breaking
- 2cd6d63: Updates how `defineIntegration`'s `options` are handled (breaking change). They're not optional by default, you need to manually add `.optional()` at the end of your zod schema. If it's optional, users can still pass nothing or `undefined`.
- 236bfbe: Simplifies plugins generics, allowing simpler plugin builds. This should be non-breaking for plugin relying on type inference, plugins with explicitly declared signature should update the following:

  ```diff
  type SomePlugin = Plugin<
    "utilityName",
    "astro:config:setup",
  -  (p: HookParams) => (params: UtilityParams) => UtilityOutput
  +  (params: UtilityParams) => UtilityOutput
  >;

  export const somePlugin: SomePlugin = definePlugin();
  ```

### Patch Changes

- 0499791: Add support for Astro DB hooks. See [docs](https://astro-integration-kit.netlify.app/core/define-integration/#astro-db-astrojsdb).

## 0.6.1

### Patch Changes

- d73c9e0: Updates `addVitePlugin` plugin type from `Plugin` to `PluginOption` to align with vite's configuration.

## 0.6.0

### Minor Changes

- c2f01fb: Adds a new `hasVitePlugin` utility. Other utilities have been updated to use it under the hood and warn when duplicate Vite plugins are created
- fc64f03: Allows passing imports as an array to `addVirtualImports` for more advanced use cases (eg. for different versions on server and client). This is a breaking change when using it as a utility as it now requires a new `config` prop

## 0.5.1

### Patch Changes

- c9f8870: Updates `addDts` to prettify the content automatically

## 0.5.0

### Minor Changes

- 3fc73d0: Updates `addVirtualImport` to `addVirtualImports` with the ability to resolve multiple imports using a single Vite plugin

## 0.4.0

### Minor Changes

- 2863031: Adds 2 new utilities, `addIntegration` as well as `addDevToolbarFrameworkApp` that allows you to build Dev Toolbar Apps using UI framework components!

### Patch Changes

- c445660: Updates the `optionsSchema` constraint to allow any schema shape

## 0.3.1

### Patch Changes

- 9835e32: Fixes issues reported by `tsc --noEmit` in users projects

## 0.3.0

### Minor Changes

- 8369363: Adds a new utility, `injectDevRoute`

## 0.2.1

### Patch Changes

- b3a72c0: Improves error messages for `optionsSchema` parsing

## 0.2.0

### Minor Changes

- f36fead: Removes `defineOptions` and replaces the `options` argument with a new `optionsSchema` argument on `defineIntegration`

  Check out the [migration guide](https://astro-integration-kit.netlify.app/core/define-options/).

## 0.1.2

### Patch Changes

- 79200b4: Prevents virtual imports name from starting with "astro:" (reserved for Astro core)

## 0.1.1

### Patch Changes

- a3e5230: Fixes type definition for integration setup `options`

## 0.1.0

### Minor Changes

- f05c7ab: Introduces plugins and improves documentation

## 0.0.12

### Patch Changes

- ea175b0: Fixes impossible types related to `defineIntegration` options

## 0.0.11

### Patch Changes

- 08e73d9: Updates imports from `node:path` to `pathe`

## 0.0.10

### Patch Changes

- 7a50397: Updates the `hasIntegration` utility to support relative position check

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

## 0.0.9

### Patch Changes

- 3276ecc: Adds the `addDts` utility
- d1b5cd3: Makes `defineIntegration` option `defaults` optional

## 0.0.8

### Patch Changes

- 9b3c1e2: Simplifies usage by providing additional utilities through extended hooks

## 0.0.7

### Patch Changes

- 97de1ae: Adds the `hasIntegration` utility
- 1ff8675: Improves JSDoc annotations

## 0.0.6

### Patch Changes

- f34c2e7: Makes `watchIntegration` synchronous
- 7b5ee7c: Adds a `addVitePlugin` utility
- eaa2122: Improves `defineIntegration` API

## 0.0.5

### Patch Changes

- ce17a1e: Adds the `defineIntegration` utility and all-in/vanilla modes

## 0.0.4

### Patch Changes

- 78a793e: Adds `addVirtualImport` utility

## 0.0.3

### Patch Changes

- 7ce3b82: Improves imports

## 0.0.2

### Patch Changes

- 40add83: Adds `watchIntegration` utility

## 0.0.1

### Patch Changes

- c381925: add createResolver
