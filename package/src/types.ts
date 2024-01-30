type Hooks = NonNullable<import("astro").AstroIntegration["hooks"]>;

export interface ExtendedHooks {
	"astro:config:setup"?: AddParam<
		Hooks["astro:config:setup"],
		{
			/**
			 * Allows to inject .d.ts file in users project. It will create a file inside `.astro`
			 * and reference it from `src/env.d.ts`.
			 *
			 * @param {object} params
			 * @param {string} params.name - The name of the .d.ts file. Eg `test` will generate `.astro/test.d.ts`
			 * @param {string} params.content
			 *
			 * @example
			 * ```ts
			 * addDts({
			 * 	 name: "my-integration",
			 * 	 content: `declare module "virtual:my-integration" {}`
			 * })
			 * ```
			 *
			 * @see https://astro-integration-kit.netlify.app/utilities/add-dts/
			 */
			addDts: (params: { name: string; content: string }) => void;
			/**
			 * Creates a Vite virtual module and updates the Astro config.
			 * Virtual imports are useful for passing things like config options, or data computed within the integration.
			 *
			 * @param {object} params
			 * @param {string} params.name
			 * @param {string} params.content
			 *
			 * @see https://astro-integration-kit.netlify.app/utilities/add-virtual-import/
			 *
			 * @example
			 * ```ts
			 * // my-integration/index.ts
			 * import { addVirtualImport } from "astro-integration-kit";
			 *
			 * addVirtualImport(
			 *   name: 'virtual:my-integration/config',
			 *   content: `export default ${ JSON.stringify({foo: "bar"}) }`,
			 * );
			 * ```
			 *
			 * This is then readable anywhere else in your integration:
			 *
			 * ```ts
			 * // myIntegration/src/component/layout.astro
			 * import config from "virtual:my-integration/config";
			 *
			 * console.log(config.foo) // "bar"
			 * ```
			 */
			addVirtualImport: (params: { name: string; content: string }) => void;
			/**
			 * Adds a [vite plugin](https://vitejs.dev/guide/using-plugins) to the
			 * Astro config.
			 *
			 * @param {Params} params
			 * @param {import("vite").Plugin} params.plugin
			 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
			 *
			 * @see https://astro-integration-kit.netlify.app/utilities/add-vite-plugin/
			 *
			 * @example
			 * ```ts
			 *  addVitePlugin(plugin)
			 * ```
			 */
			addVitePlugin: (plugin: import("vite").Plugin) => void;
			/**
			 * Checks whether an integration is already installed.
			 *
			 * @param {string} name - Name of the integration to look up.
			 * @param {undefined | "before" | "after"} options.position - Position in relation to the current integration to check.
			 *
			 * @returns {boolean}
			 *
			 * @see https://astro-integration-kit.netlify.app/utilities/has-integration/
			 *
			 * @example
			 * ```ts
			 *  hasIntegration("@astrojs/tailwind")
			 * ```
			 */
			hasIntegration: (name: string, options?: {
				position?: "before" | "after",
			}) => boolean;
			/**
			 * In development, will reload the Astro dev server if any files within
			 * the integration directory has changed.
			 *
			 * @param {string} dir - This is the directory you want to watch for changes
			 *
			 * @see https://astro-integration-kit.netlify.app/utilities/watch-integration/
			 *
			 * @example
			 * ```ts
			 * watchIntegration(resolve())
			 * ```
			 */
			watchIntegration: (dir: string) => void;
		}
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
