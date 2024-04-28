---
"astro-integration-kit": patch
---

Simplify emitted declarations for dependent integrations.

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
      injectScript: (stage: astro.InjectedScriptStage, content: string) => void;
      injectRoute: (injectRoute: astro.InjectedRoute) => void;
      addClientDirective: (directive: astro.ClientDirectiveConfig) => void;
      addDevOverlayPlugin: (entrypoint: string) => void;
      addDevToolbarApp: (entrypoint: string | astro.DevToolbarAppEntry) => void;
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
