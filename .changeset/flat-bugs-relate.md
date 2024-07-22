---
"astro-integration-kit": minor
---

Improve emitted inferred types for libraries

For the following code:

```ts
export const utility = defineUtility('astro:config:setup')((
	params: HookParameters<'astro:config:setup'>,
	options: { name: string }
) => {
	// do something
});

export const integration defineIntegration({
	name: 'some-utility',
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
