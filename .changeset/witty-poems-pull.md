---
"astro-integration-kit": minor
---

Simplifies emitted declarations for plugins.

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

As shown above, this simplification also removes the unneded re-reclaration of the plugin hook input, which is a breaking change if you are declaring your generic explicitly.
