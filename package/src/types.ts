import type { HookParameters } from "astro";

export type Plugin<
	TName extends string,
	THook extends keyof Hooks,
	TImplementation extends (
		params: HookParameters<THook>,
	) => (...args: Array<any>) => any,
> = {
	name: TName;
	hook: THook;
	dependsOn?: Array<string>;
	implementation: TImplementation;
};

export type AnyPlugin = Plugin<string, keyof Hooks, any>

export type Hooks = NonNullable<import("astro").AstroIntegration["hooks"]>;

type FilterPluginsByHook<
  TPlugins extends Array<Plugin<any, any, any>>,
  THook extends keyof Hooks
> = Extract<TPlugins[number], { hook: THook }>;

type PluginsToObject<TPlugin extends Plugin<string, keyof Hooks, any>> = {
  [K in TPlugin['name']]: TPlugin extends Plugin<K, infer Hook, infer Implementation>
    ? Hook extends keyof Hooks
      ? ReturnType<Implementation>
      : never
    : never;
};

type A = Plugin<"a", "astro:config:setup", () => (param: string) => boolean> 
type B = Plugin<"b", "astro:config:done", () => () => number> 
type C = Plugin<"c", "astro:config:done", () => () => string> 
type X1 = FilterPluginsByHook<[A,B,C], "astro:config:setup">
type X2 = FilterPluginsByHook<[A,B,C], "astro:config:done">

type Y1 = PluginsToObject<X1>
type Y2 = PluginsToObject<X2>

export interface ExtendedHooks<TPlugins extends Array<AnyPlugin>> {
	"astro:config:setup"?: AddParam<
		Hooks["astro:config:setup"],
		PluginsToObject<FilterPluginsByHook<TPlugins, "astro:config:setup">>
		// {
		// 	/**
		// 	 * Allows to inject .d.ts file in users project. It will create a file inside `.astro`
		// 	 * and reference it from `src/env.d.ts`.
		// 	 *
		// 	 * @param {object} params
		// 	 * @param {string} params.name - The name of the .d.ts file. Eg `test` will generate `.astro/test.d.ts`
		// 	 * @param {string} params.content
		// 	 *
		// 	 * @example
		// 	 * ```ts
		// 	 * addDts({
		// 	 * 	 name: "my-integration",
		// 	 * 	 content: `declare module "virtual:my-integration" {}`
		// 	 * })
		// 	 * ```
		// 	 *
		// 	 * @see https://astro-integration-kit.netlify.app/utilities/add-dts/
		// 	 */
		// 	addDts: (params: { name: string; content: string }) => void;
		// 	/**
		// 	 * Creates a Vite virtual module and updates the Astro config.
		// 	 * Virtual imports are useful for passing things like config options, or data computed within the integration.
		// 	 *
		// 	 * @param {object} params
		// 	 * @param {string} params.name
		// 	 * @param {string} params.content
		// 	 *
		// 	 * @see https://astro-integration-kit.netlify.app/utilities/add-virtual-import/
		// 	 *
		// 	 * @example
		// 	 * ```ts
		// 	 * // my-integration/index.ts
		// 	 * import { addVirtualImport } from "astro-integration-kit";
		// 	 *
		// 	 * addVirtualImport(
		// 	 *   name: 'virtual:my-integration/config',
		// 	 *   content: `export default ${ JSON.stringify({foo: "bar"}) }`,
		// 	 * );
		// 	 * ```
		// 	 *
		// 	 * This is then readable anywhere else in your integration:
		// 	 *
		// 	 * ```ts
		// 	 * // myIntegration/src/component/layout.astro
		// 	 * import config from "virtual:my-integration/config";
		// 	 *
		// 	 * console.log(config.foo) // "bar"
		// 	 * ```
		// 	 */
		// 	addVirtualImport: (params: { name: string; content: string }) => void;
		// 	/**
		// 	 * Adds a [vite plugin](https://vitejs.dev/guide/using-plugins) to the
		// 	 * Astro config.
		// 	 *
		// 	 * @param {Params} params
		// 	 * @param {import("vite").Plugin} params.plugin
		// 	 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
		// 	 *
		// 	 * @see https://astro-integration-kit.netlify.app/utilities/add-vite-plugin/
		// 	 *
		// 	 * @example
		// 	 * ```ts
		// 	 *  addVitePlugin(plugin)
		// 	 * ```
		// 	 */
		// 	addVitePlugin: (plugin: import("vite").Plugin) => void;
		// 	/**
		// 	 * Checks whether an integration is already installed.
		// 	 *
		// 	 * @param {string} name - Name of the integration to look up.
		// 	 * @param {undefined | "before" | "after"} position - Position in relation to the current integration to check.
		// 	 * @param {undefined | string} relativeTo - The integration to check the position against. Defaults to the current integration.
		// 	 *
		// 	 * @returns {boolean}
		// 	 *
		// 	 * @see https://astro-integration-kit.netlify.app/utilities/has-integration/
		// 	 *
		// 	 * @example
		// 	 * ```ts
		// 	 *  hasIntegration("@astrojs/tailwind")
		// 	 * ```
		// 	 */
		// 	hasIntegration: (
		// 		...params:
		// 			| [name: string]
		// 			| [name: string, position: "before" | "after"]
		// 			| [name: string, position: "before" | "after", relativeTo: string]
		// 	) => boolean;
		// 	/**
		// 	 * In development, will reload the Astro dev server if any files within
		// 	 * the integration directory has changed.
		// 	 *
		// 	 * @param {string} dir - This is the directory you want to watch for changes
		// 	 *
		// 	 * @see https://astro-integration-kit.netlify.app/utilities/watch-integration/
		// 	 *
		// 	 * @example
		// 	 * ```ts
		// 	 * watchIntegration(resolve())
		// 	 * ```
		// 	 */
		// 	watchIntegration: (dir: string) => void;
		// }
	>;
	"astro:config:done"?: AddParam<Hooks["astro:config:done"]>;
	"astro:server:setup"?: AddParam<Hooks["astro:server:setup"]>;
	"astro:server:start"?: AddParam<Hooks["astro:server:start"]>;
	"astro:server:done"?: AddParam<Hooks["astro:server:done"]>;
	"astro:build:start"?: AddParam<Hooks["astro:build:start"]>;
	"astro:build:setup"?: AddParam<Hooks["astro:build:setup"]>;
	"astro:build:generated"?: AddParam<Hooks["astro:build:generated"]>;
	"astro:build:ssr"?: AddParam<Hooks["astro:build:ssr"]>;
	"astro:build:done"?: AddParam<Hooks["astro:build:done"]>;
}

type AddParam<Func, Param = Record<never, never>> = Func extends (
	params: infer Params,
) => infer ReturnType
	? (params: Params & Param) => ReturnType
	: never;
